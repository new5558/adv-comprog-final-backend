import { Service, Inject } from "typedi";
import { ICourseRegisterDTO, ICourse } from "../interfaces/ICourse";
import { IUserInfoDTO } from "../interfaces/IUser";
import { IAcademicYear } from "../interfaces/IAcademicYear";
import { Model } from "mongoose";
import createError, { HttpError } from "http-errors";
import { Degree, RequiredDegree } from "../interfaces/ICommon";
import groupBy from "lodash/groupBy";

@Service()
export default class UserService {
  @Inject("courseModel")
  courseModel: Model<ICourse>;

  @Inject("academicYearModel")
  AcademicYearModel: Model<IAcademicYear>;

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
          return createError(403, "Not in registration period");
        }

        // check studentType and degree
        if (
          userInfo.studentType === currentCourse.studentType &&
          !this.checkDegree(userInfo.degree, currentCourse.requiredDegree)
        ) {
          return createError(
            403,
            "Course Not allowed for student type or degree"
          );
        }

        // check capacity full?
        const currentSection = currentCourse.section.find(
          section => section.sectionNumber === courseToRegister.sectionNumber
        );
        if (
          currentSection &&
          currentSection.enrolledStudent.length <= currentSection.capacity
        ) {
          return createError(403, "Course capacity full");
        }

        // check condition pass
        let conditionPass = true;
        currentCourse.requirement.forEach(requiredCourse => {
          const _registeredCourse = userInfo.registeredCourses.find(
            registeredCourse => registeredCourse.id === requiredCourse
          );
          if (!_registeredCourse || _registeredCourse.grade <= 5) {
            conditionPass = false;
          }
        });
        if (!conditionPass) {
          return createError(403, "Conditional Course is required");
        }

        // check if course already registered?
        const registeredCourse = userInfo.registeredCourses.find(
          registeredCourse => registeredCourse.id === currentCourse._id
        );
        if (
          registeredCourse &&
          registeredCourse.status === 2 &&
          registeredCourse.grade <= 5
        ) {
          return createError(403, "Course already registered");
        }
      }
      return courseToRegister;
    });
    const courseToRegisters = courseValidationResults.filter(course => {
      return !(course instanceof createError.HttpError);
    });
    console.log("validationResult", courseValidationResults);
    const courseToRegistersBySection = groupBy(
      courseToRegisters,
      course => course.sectionNumber
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
            $push: { [`section.${section.order}.enrolledStudent`]: userInfo._id }
          }
        );
      })
    );
  }

  private checkDegree(
    currentDegree: Degree,
    requiredDegree: RequiredDegree
  ): boolean {
    if ((requiredDegree = 0 && currentDegree <= 5)) {
      return true;
    }
    return currentDegree === requiredDegree + 5;
  }
}
