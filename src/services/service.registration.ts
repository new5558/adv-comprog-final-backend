import { Service, Inject } from "typedi";
import { ICourseRegisterDTO, CourseUnioned, WithdawalResult } from "../interfaces/ICourse";
import { RegisteredCourse } from "../interfaces/IUser";
import { Schema } from "mongoose";
import createError, { HttpError } from "http-errors";
import groupBy from "lodash/groupBy";
import UserDataService from "../data-services/db.service.user";
import { unionByKey, compareObjectID } from "../helpers/utils";
import CourseDataService from "../data-services/db.service.course";
import AcademicYearDataService from "../data-services/db.service.academicYear";
import {
  checkRegistrationPeriod,
  checkCreditAvailibity,
  checkStudentTypeAndDegree,
  checkCourseCapacity,
  checkPriorCourseRequirement,
  checkCourseAlreadyRegistered
} from "../helpers/utils.register";
import { Dictionary } from "express-serve-static-core";

@Service()
export default class RegistrationsService {
  @Inject()
  courseDataService: CourseDataService;

  @Inject()
  userDataService: UserDataService;

  @Inject()
  academicYearDataService: AcademicYearDataService;

  public async register(
    courses: ICourseRegisterDTO[],
    userID: Schema.Types.ObjectId
  ) {
    const userInfo = await this.userDataService.getUserInfo(userID);
    const currentAcademicYear = await this.academicYearDataService.getCurrentAcademicYear();
    const uuids = courses.map(course => course.uuid);
    const coursesToRegister = await this.courseDataService.findCourses(uuids);

    const isCreditavailable = checkCreditAvailibity(coursesToRegister);
    if (!isCreditavailable) {
      throw createError(422, "Total credit exceeded 21");
    }

    const coursesUnioned: CourseUnioned[] = unionByKey(
      coursesToRegister,
      courses,
      "uuid"
    );
    const courseValidationResults = coursesUnioned.map(courseToRegister => {
      if (!courseToRegister.courseNumber) {
        return createError(403, "Course not found");
      }
      const isInRegistrationPeriod = checkRegistrationPeriod(
        courseToRegister,
        currentAcademicYear
      );
      const isStudentTypeAndDegreeMatched = checkStudentTypeAndDegree(
        courseToRegister,
        userInfo
      );
      const hasSeatsAvailable = checkCourseCapacity(courseToRegister);
      const isPriorCourseRequiredRegistered = checkPriorCourseRequirement(
        courseToRegister,
        userInfo
      );
      const isCourseAlreadyRegistered = checkCourseAlreadyRegistered(
        courseToRegister,
        userInfo
      );

      if (!isInRegistrationPeriod) {
        return createError(403, "Not in registration period");
      }
      if (!isStudentTypeAndDegreeMatched) {
        return createError(
          403,
          "Course Not allowed for student type or degree"
        );
      }
      if (!hasSeatsAvailable) {
        return createError(403, "Course capacity full");
      }
      if (!isPriorCourseRequiredRegistered) {
        return createError(403, "Conditional Course is required");
      }
      if (!isCourseAlreadyRegistered) {
        return createError(403, "Course already registered");
      }
      return {
        data: courseToRegister._id,
        sectionNumber: courseToRegister.sectionNumber,
        status: 0
      } as RegisteredCourse;
    });

    const courseToRegistersSuccess = courseValidationResults.filter(course => {
      return !(course instanceof HttpError);
    }) as RegisteredCourse[];

    if (courseToRegistersSuccess.length === 0) {
      const courseToRegistersFailed = courseValidationResults.filter(course => {
        return course instanceof HttpError;
      }) as HttpError[];
      throw createError(403, courseToRegistersFailed);
    }

    const courseToRegistersBySection = groupBy(
      courseToRegistersSuccess,
      course => course.sectionNumber
    ) as Dictionary<RegisteredCourse[]>;

    await this.userDataService.insertNewCourses(
      courseToRegistersSuccess,
      userInfo._id
    );
    await this.courseDataService.registerStudents(
      courseToRegistersBySection,
      userInfo
    );
    return courseValidationResults;
  }

  async getRegistrationResult(userID: Schema.Types.ObjectId) {
    /* @Todo only show one result of same course, year, semester 
    (multiple results should not happen if reattempt to register the course) */
    const courses = (await this.userDataService.getFullUserInfo(userID))
      .registeredCourses;
    const currentAcademicYear = await this.academicYearDataService.getCurrentAcademicYear();
    if (currentAcademicYear) {
      const registrationResult = courses
        .filter(course => {
          return (
            course.data.year === currentAcademicYear.year &&
            course.data.semester === currentAcademicYear.semester &&
            course.status <= 2
          );
        })
        .map(course => {
          return {
            year: course.data.year,
            semester: course.data.semester,
            courseNumber: course.data.courseNumber,
            engName: course.data.engName,
            credit: course.data.credit,
            status: course.status
          };
        });
      return registrationResult;
    }
    throw createError(403, "Not in registration period");
  }

  async withdraw(userID: Schema.Types.ObjectId, subjectsToWithdraw: string[]): Promise<WithdawalResult> {
    const {
      registeredCourses,
      username,
      studentType,
      faculty,
      name
    } = await this.userDataService.getFullUserInfo(userID);
    const currentAcademicYear = await this.academicYearDataService.getCurrentAcademicYear();

    if (currentAcademicYear) {
      const currentTime = new Date();
      const subjectsForWithdrawValidated = subjectsToWithdraw
        .filter(subjectToWithdraw => {
          const course = registeredCourses.find(
            subject => subject.data.uuid === subjectToWithdraw
          );
          return (
            course &&
            course.data.year === currentAcademicYear.year &&
            course.data.semester === currentAcademicYear.semester
          );
        })
        .map(subjectToWithdraw => {
          const course = registeredCourses.find(
            course => course.data.uuid === subjectToWithdraw
          );
          if (!course) {
            return createError(404, "Course not found");
          }
          if (course.data.finalDate) {
            return createError(403, "The final examination has been arranged");
          }
          if (course.status === 3) {
            return createError(
              403,
              "The course is already graded or not sucessfully registered"
            );
          }
          if (
            currentTime < currentAcademicYear.withdrawalStartDate ||
            currentTime > currentAcademicYear.withdrawalEndDate
          ) {
            return createError(403, "Not in withdrawwal period");
          }
          return {
            courseNumber: course.data.courseNumber,
            engName: course.data.engName,
            credit: course.data.credit
          };
        });

      const courseToWithdrawSuccess: any[] = [];
      const courseToWithdrawFailed: HttpError[] = [];
      subjectsForWithdrawValidated.forEach(course => {
        const error = course instanceof HttpError;
        error
          ? courseToWithdrawFailed.push(course as HttpError)
          : courseToWithdrawSuccess.push(course);
      });
      if (courseToWithdrawSuccess.length === 0) {
        if (courseToWithdrawFailed.length === 0) {
          throw createError(403, "Cannot match any course to withdraw");
        }
        throw createError(403, courseToWithdrawFailed);
      }

      return {
        courseToWithdrawSuccess,
        courseToWithdrawFailed,
        year: currentAcademicYear.year,
        semester: currentAcademicYear.semester,
        username,
        studentType,
        faculty,
        name
      };
    }
    throw createError(500, "Not in registration peroid");
  }
}
