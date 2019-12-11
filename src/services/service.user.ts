import { Service, Inject } from "typedi";
import { Schema } from "mongoose";
import UserDataService from "../data-services/db.service.user";
import {
  RegisteredCourse,
  IUserInfoDTO,
  IUserGrade
} from "../interfaces/IUser";
import groupBy = require("lodash/groupBy");

@Service()
export default class UserService {
  @Inject()
  userDataService: UserDataService;

  async getUserInfo(userID: Schema.Types.ObjectId): Promise<IUserInfoDTO> {
    return this.userDataService.getUserInfo(userID);
  }

  async getFullUserInfo(userID: Schema.Types.ObjectId): Promise<IUserInfoDTO> {
    return this.userDataService.getFullUserInfo(userID);
  }

  async getCourses(userID: Schema.Types.ObjectId): Promise<RegisteredCourse[]> {
    return (await this.userDataService.getFullUserInfo(userID))
      .registeredCourses;
  }

  async getGrades(userID: Schema.Types.ObjectId) {
    const courses = await this.getCourses(userID);
    const courseBySemester = groupBy(courses, course =>
      JSON.stringify({ year: course.data.year, semester: course.data.semester })
    );
    const grades: IUserGrade[] = [];
    Object.keys(courseBySemester).map(key => {
      return courseBySemester[key].forEach(course => {
        if (course.status === 3) {
          grades.push({
            year: course.data.year,
            semester: course.data.semester,
            courseNumber: course.data.courseNumber,
            engName: course.data.engName,
            credit: course.data.credit,
            grade: course.grade
          });
        }
      });
    });
    return grades;
  }

  async insertNewCourses(
    courseToSaveInUserDB: RegisteredCourse[],
    userID: Schema.Types.ObjectId
  ): Promise<IUserInfoDTO> {
    return this.userDataService.insertNewCourses(courseToSaveInUserDB, userID);
  }
}
