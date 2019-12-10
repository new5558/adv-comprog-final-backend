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
  @Inject("CourseModel")
  courseModel: Model<ICourse>;

  @Inject("academicYearModel")
  AcademicYearModel: Model<IAcademicYear>;

  public async register(courses: ICourseRegisterDTO[], userInfo: IUserInfoDTO) {
    // check credit full
    const totalCredit = courses.reduce((acc: number, course) => {
      return acc + course.credit;
    }, 0);
    if (totalCredit > 21) {
      return createError(422, "Total credit exceeded 21");
    }
    const registrationYears = await this.AcademicYearModel.find({});
    const courseNumbers = courses.map(course => course.courseNumber);
    const currentCourses = await this.courseModel.find({
      courseNumber: { $in: courseNumbers }
    });
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
          !this.checkDegree(userInfo.degree, currentCourse.degree)
        ) {
          return createError(
            403,
            "Course Not allowed for student type or degree"
          );
        }

        // check capacity full?
        const studentCapacity = currentCourse.section.reduce(
          (acc, section) => {
            acc.totalAmount + section.enrolledStudent.length;
            acc.capacity + section.capacity;
            return acc;
          },
          { totalAmount: 0, capacity: 0 }
        );
        if (studentCapacity.totalAmount <= studentCapacity.capacity) {
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
    const courseToRegistersBySection = groupBy(
      courseToRegisters,
      course => course.sectionNumber
    );

    console.log(courseToRegistersBySection, "section");
    Object.keys(courseToRegistersBySection)
      .map(key => ({ key, value: courseToRegistersBySection[key] }))
      .forEach(section => {
        this.courseModel.updateMany(
          {
            _id: {
              $in: section.value
            }
          },
          {
            $push: { [`section.${section.key}.enrolledStudent`]: userInfo._id }
          }
        );
      });
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
