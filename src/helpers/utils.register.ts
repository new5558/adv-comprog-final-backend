import { ICourse, CourseUnioned } from "../interfaces/ICourse";
import { IAcademicYear } from "../interfaces/IAcademicYear";
import { compareObjectID } from "./utils";
import { IUser } from "../interfaces/IUser";

export const checkRegistrationPeriod = (
  currentCourse: ICourse,
  currentAcademicYear: IAcademicYear | null
) => {
  // check year and semester
  const currentDate = new Date();
  console.log('currentAcademicYear', currentAcademicYear, currentCourse);
  if (currentAcademicYear) {
    const {
      registrationStartDate,
      registrationEndDate,
      year,
      semester
    } = currentAcademicYear;
    return (
      registrationStartDate < currentDate &&
      registrationEndDate > currentDate &&
      currentCourse.year === year &&
      currentCourse.semester === semester
    );
  }
  return false;
};

export const checkStudentTypeAndDegree = (
  currentCourse: ICourse,
  userInfo: IUser
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
  userInfo: IUser
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
  userInfo: IUser
) => {
  // check if course already registered?
  const registeredCourse = userInfo.registeredCourses.find(registeredCourse =>
    compareObjectID(currentCourse._id, registeredCourse.data)
  );
  if (
    registeredCourse &&
    (registeredCourse.status <= 1 ||
      (registeredCourse.status === 3 && registeredCourse.grade <= 5))
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
