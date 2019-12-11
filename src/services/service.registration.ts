import { Service, Inject } from "typedi";
import {
  ICourseRegisterDTO,
  CourseToRegisterBySections,
  CourseUnioned
} from "../interfaces/ICourse";
import { RegisteredCourse } from "../interfaces/IUser";
import { Schema } from "mongoose";
import createError from "http-errors";
import groupBy from "lodash/groupBy";
import UserDataService from "../data-services/db.service.user";
import { unionByKey } from "../helpers/utils";
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
    const registrationYears = await this.academicYearDataService.getAcademicYear();
    const uuids = courses.map(course => course.uuid);
    const coursesToRegister = await this.courseDataService.findCoursesByUniqueId(
      uuids
    );

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
        registrationYears
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
      return courseToRegister;
    });
    const courseToRegistersSuccess = courseValidationResults.filter(course => {
      return !(course instanceof createError.HttpError);
    });
    const courseToRegistersFailed = courseValidationResults.filter(course => {
      return course instanceof createError.HttpError;
    });
    if (courseToRegistersSuccess.length === 0) {
      throw createError(403, courseToRegistersFailed);
    }
    const courseToRegistersBySection = groupBy(
      courseToRegistersSuccess,
      course => course.sectionNumber
    ) as CourseToRegisterBySections;

    const courseToSaveInUserDB = courseToRegistersSuccess.map(
      course =>
        ({
          uuid: course.uuid,
          status: 0
        } as RegisteredCourse)
    );
    await this.userDataService.insertNewCourses(
      courseToSaveInUserDB,
      userInfo._id
    );

    await this.courseDataService.registerStudents(
      courseToRegistersBySection,
      userInfo
    );
    return courseValidationResults;
  }
}
