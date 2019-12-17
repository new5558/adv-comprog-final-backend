import { Service, Inject } from "typedi";
import { Schema } from "mongoose";
import UserDataService from "../data-services/db.service.user";
import {
  RegisteredCourse,
  IUserInfoDTO,
  IUserGrade
} from "../interfaces/IUser";
import groupBy = require("lodash/groupBy");
import { ICourse } from "../interfaces/ICourse";
import { modelToObj, cleanRegisterdCourses } from "../helpers/utils";

@Service()
export default class UserService {
  @Inject()
  userDataService: UserDataService;

  async getUserInfo(userID: Schema.Types.ObjectId): Promise<IUserInfoDTO> {
    const userInfoModel = await this.userDataService.getUserInfo(userID);
    const userInfo = modelToObj<IUserInfoDTO>(userInfoModel) as IUserInfoDTO;
    userInfo.registeredCourses = cleanRegisterdCourses(
      userInfo.registeredCourses
    );
    return userInfo;
  }

  async getFullUserInfo(userID: Schema.Types.ObjectId): Promise<IUserInfoDTO> {
    const fullUserInfoModel = await this.userDataService.getFullUserInfo(
      userID
    );
    const fullUserInfo = modelToObj<IUserInfoDTO>(
      fullUserInfoModel
    ) as IUserInfoDTO;
    fullUserInfo.registeredCourses = fullUserInfo.registeredCourses.map(
      course => {
        course.uuid = undefined;
        return course;
      }
    );
    return fullUserInfo;
  }

  async getCourses(userID: Schema.Types.ObjectId): Promise<RegisteredCourse[]> {
    const fullUserInfo = await this.userDataService.getFullUserInfo(userID);
    return (modelToObj<IUserInfoDTO>(fullUserInfo) as IUserInfoDTO)
      .registeredCourses;
  }

  async getGrades(userID: Schema.Types.ObjectId) {
    const courses = await this.getCourses(userID);
    const courseBySemester = groupBy(courses, course => {
      const courseData = course.data as ICourse;
      return JSON.stringify({
        year: courseData.year,
        semester: courseData.semester
      });
    });
    const grades: IUserGrade[] = [];
    Object.keys(courseBySemester).map(key => {
      return courseBySemester[key].forEach(course => {
        const courseData = course.data as ICourse;
        if (course.status === 3) {
          grades.push({
            year: courseData.year,
            semester: courseData.semester,
            courseNumber: courseData.courseNumber,
            engName: courseData.engName,
            credit: courseData.credit,
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
