import { ICourse, CourseUnioned } from "../interfaces/ICourse";
import { IAcademicYear } from "../interfaces/IAcademicYear";
import { IUserInfoDTO } from "../interfaces/IUser";
import { ObjectID } from "mongodb";
import { Schema } from "mongoose";

export const checkRegistrationPeriod = (
  currentCourse: ICourse,
  registrationYears: IAcademicYear[]
) => {
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
};

export const checkStudentTypeAndDegree = (
  currentCourse: ICourse,
  userInfo: IUserInfoDTO
) => {
  if (!(userInfo.studentType === currentCourse.studentType)) {
    return false;
  }
  const { requiredDegree } = currentCourse;
  if (requiredDegree >= 0 && requiredDegree <= 5) {
    return true;
  }
  return userInfo.degree === currentCourse.requiredDegree + 5;
};

export const checkCourseCapacity = (courseToRegister: CourseUnioned) => {
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
};

export const checkPriorCourseRequirement = (
  currentCourse: ICourse,
  userInfo: IUserInfoDTO
) => {
  // check condition pass
  let conditionPass = true;
  currentCourse.requirement.forEach(requiredCourse => {
    const _registeredCourse = userInfo.registeredCourses.find(
      registeredCourse => compareObjectID(registeredCourse.data, requiredCourse)
    );
    if (!_registeredCourse || _registeredCourse.grade >= 5) {
      conditionPass = false;
    }
  });
  return conditionPass;
};

export const checkCourseAlreadyRegistered = (
  currentCourse: ICourse,
  userInfo: IUserInfoDTO
) => {
  console.log(currentCourse._id, userInfo.registeredCourses, 'check already registered');;
  // check if course already registered?
  const registeredCourse = userInfo.registeredCourses.find(
    registeredCourse => compareObjectID(currentCourse._id, registeredCourse.data)
  );
  if (
    registeredCourse &&
    (registeredCourse.status === 0 ||
      (registeredCourse.status === 1 && registeredCourse.grade <= 5))
  ) {
    return false;
  }
  return true;
};

export const checkCreditAvailibity = (coursesToRegister: ICourse[]) => {
  // check credit full
  // @Todo recheck with registered course
  const totalCredit = coursesToRegister.reduce((acc: number, course) => {
    return acc + course.credit;
  }, 0);
  if (totalCredit > 21) {
    return false;
  }
  return true;
};

export const compareObjectID = (id1: Schema.Types.ObjectId, id2: Schema.Types.ObjectId) => {
  return JSON.stringify(id1) === JSON.stringify(id2);
}