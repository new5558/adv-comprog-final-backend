import { Service, Inject } from "typedi";
import { Schema } from "mongoose";
import UserDataService from "../data-services/db.service.user";
import { RegisteredCourse, IUserInfoDTO } from "../interfaces/IUser";

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

  async insertNewCourses(
    courseToSaveInUserDB: RegisteredCourse[],
    userID: Schema.Types.ObjectId
  ): Promise<IUserInfoDTO> {
    return this.userDataService.insertNewCourses(courseToSaveInUserDB, userID);
  }
}
