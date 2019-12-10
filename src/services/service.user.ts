import { Service, Inject } from "typedi";
import { ICourseRegisterDTO, ICourse } from "../interfaces/ICourse";
import { IUserInfoDTO, IUser, RegisteredCourse } from "../interfaces/IUser";
import { IAcademicYear } from "../interfaces/IAcademicYear";
import { Model } from "mongoose";
import createError, { HttpError } from "http-errors";
import groupBy from "lodash/groupBy";

@Service()
export default class UserService {
  @Inject("courseModel")
  courseModel: Model<ICourse>;

  @Inject("academicYearModel")
  AcademicYearModel: Model<IAcademicYear>;

  @Inject("userModel")
  userModel: Model<IUser>;

  public async register(courses: ICourseRegisterDTO[], userInfo: IUserInfoDTO) {
    const registrationYears = await this.AcademicYearModel.find({});
    const uuids = courses.map(course => course.uuid);
    const currentCourses = await this.courseModel.find({
      uuid: { $in: uuids }
    });

    // check credit full
    const totalCredit = currentCourses.reduce((acc: number, course) => {
      return acc + course.credit;
    }, 0);
    if (totalCredit > 21) {
      return createError(422, "Total credit exceeded 21");
    }

    const courseValidationResults: (
      | ICourseRegisterDTO
      | HttpError
    )[] = courses.map((courseToRegister, index) => {
      const currentCourse = currentCourses[index];
      if (currentCourse) {
        const isInRegistrationPeroid = this.checkRegistrationPeriod(
          currentCourse,
          registrationYears
        );
        const isStudentTypeAndDegreeMatched = this.checkStudentTypeAndDegree(
          currentCourse,
          userInfo
        );
        const hasSeatsAvailable = this.checkCourseCapacity(
          currentCourse,
          courseToRegister
        );
        const isPriorCourseRequiredRegistered = this.checkPriorCourseRequirement(
          currentCourse,
          userInfo
        );
        const isCourseAlreadyRegistered = this.checkCourseAlreadyRegistered(
          currentCourse,
          userInfo
        );

        if (!isInRegistrationPeroid) {
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
      }
      return courseToRegister;
    });
    const courseToRegisters = courseValidationResults.filter(course => {
      return !(course instanceof createError.HttpError);
    });
    // console.log("validationResult", courseValidationResults);
    const courseToRegistersBySection = groupBy(
      courseToRegisters,
      course => course.sectionNumber
    );

    const courseToSaveInUserDB = courseToRegisters.map(
      course =>
        ({
          uuid: course.uuid,
          status: 0
        } as RegisteredCourse)
    );
    await this.userModel.update(
      { _id: userInfo._id },
      {
        $push: {
          registeredCourses: {
            $each: courseToSaveInUserDB
          }
        }
      }
    );
    Promise.all(
      Object.keys(courseToRegistersBySection).map(async key => {
        const section = {
          order: Number(key) - 1,
          uuid: courseToRegistersBySection[key].map(course => course.uuid)
        };
        await this.courseModel.updateMany(
          {
            uuid: {
              $in: section.uuid
            }
          },
          {
            $push: {
              [`section.${section.order}.enrolledStudent`]: userInfo._id
            }
          }
        );
      })
    );
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

  private checkCourseCapacity(
    currentCourse: ICourse,
    courseToRegister: ICourseRegisterDTO
  ) {
    // check capacity full?
    const currentSection = currentCourse.section.find(
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
}
