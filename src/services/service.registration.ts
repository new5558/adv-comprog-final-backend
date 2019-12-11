import { Service, Inject } from "typedi";
import {
  ICourseRegisterDTO,
  ICourse,
  CourseToRegisterBySections,
  CourseUnioned
} from "../interfaces/ICourse";
import { IUserInfoDTO, RegisteredCourse } from "../interfaces/IUser";
import { IAcademicYear } from "../interfaces/IAcademicYear";
import { Schema } from "mongoose";
import createError from "http-errors";
import groupBy from "lodash/groupBy";
import UserDataService from "../data-services/db.service.user";
import { unionByKey } from "../helpers/utils";
import CourseDataService from "../data-services/db.service.course";
import AcademicYearDataService from "../data-services/db.service.academicYear";

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

    const isCreditavailable = this.checkCreditAvailibity(coursesToRegister);
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
      const isInRegistrationPeriod = this.checkRegistrationPeriod(
        courseToRegister,
        registrationYears
      );
      const isStudentTypeAndDegreeMatched = this.checkStudentTypeAndDegree(
        courseToRegister,
        userInfo
      );
      const hasSeatsAvailable = this.checkCourseCapacity(courseToRegister);
      const isPriorCourseRequiredRegistered = this.checkPriorCourseRequirement(
        courseToRegister,
        userInfo
      );
      const isCourseAlreadyRegistered = this.checkCourseAlreadyRegistered(
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

  private checkRegistrationPeriod(
    currentCourse: ICourse,
    registrationYears: IAcademicYear[]
  ) {
    // check year and semester
    const currentDate = new Date();
    const registrationYear = registrationYears.find(
      academicYear =>
        academicYear.year === currentCourse.year &&
        academicYear.semester === currentCourse.semester
    );
    if (
      registrationYear &&
      registrationYear.registrationStartDate < currentDate &&
      registrationYear.registrationEndDate > currentDate
    ) {
      return false;
    }
    return true;
  }

  private checkStudentTypeAndDegree(
    currentCourse: ICourse,
    userInfo: IUserInfoDTO
  ) {
    if (!(userInfo.studentType === currentCourse.studentType)) {
      return false;
    }
    const { requiredDegree } = currentCourse;
    if (requiredDegree >= 0 && requiredDegree <= 5) {
      return true;
    }
    return userInfo.degree === currentCourse.requiredDegree + 5;
  }

  private checkCourseCapacity(courseToRegister: CourseUnioned) {
    // check capacity full?
    const currentSection = courseToRegister.section.find(
      section => section.sectionNumber === courseToRegister.sectionNumber
    );
    if (
      currentSection &&
      currentSection.enrolledStudent.length <= currentSection.capacity
    ) {
      return false;
    }
    return true;
  }

  private checkPriorCourseRequirement(
    currentCourse: ICourse,
    userInfo: IUserInfoDTO
  ) {
    // check condition pass
    let conditionPass = true;
    currentCourse.requirement.forEach(requiredCourse => {
      const _registeredCourse = userInfo.registeredCourses.find(
        registeredCourse => registeredCourse.uuid === requiredCourse
      );
      if (!_registeredCourse || _registeredCourse.grade >= 5) {
        conditionPass = false;
      }
    });
    return conditionPass;
  }

  private checkCourseAlreadyRegistered(
    currentCourse: ICourse,
    userInfo: IUserInfoDTO
  ) {
    // check if course already registered?
    const registeredCourse = userInfo.registeredCourses.find(
      registeredCourse => registeredCourse.uuid === currentCourse.uuid
    );
    if (
      registeredCourse &&
      (registeredCourse.status === 0 ||
        (registeredCourse.status === 1 && registeredCourse.grade <= 5))
    ) {
      return false;
    }
    return true;
  }

  private checkCreditAvailibity(coursesToRegister: ICourse[]) {
    // check credit full
    // to do, recheck with registered course
    const totalCredit = coursesToRegister.reduce((acc: number, course) => {
      return acc + course.credit;
    }, 0);
    if (totalCredit > 21) {
      return false;
    }
    return true;
  }
}
