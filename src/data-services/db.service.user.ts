import { Service, Inject } from "typedi";
import { Model, Schema, DocumentQuery } from "mongoose";
import {
  IUser,
  RegisteredCourse,
  IUserInfoDTO,
  IUserInputDTO
} from "../interfaces/IUser";
import createError from "http-errors";

@Service('userDataService')
export default class UserDataService {
  @Inject("userModel")
  userModel: Model<IUser>;

  async findUserByUsername(username: string): Promise<IUser | null> {
    return await this.userModel.findOne({ username });
  }

  async createUser(
    userInfo: IUserInputDTO,
    passwordHashed: string
  ): Promise<IUser> {
    return await this.userModel.create({
      ...userInfo,
      password: passwordHashed
    });
  }

  async createManyUsers(userInfos: IUserInputDTO[]): Promise<IUser[]> {
    return await this.userModel.insertMany(userInfos);
  }

  async getUserInfo(userID: Schema.Types.ObjectId): Promise<IUser> {
    const fullUserInfo = await this.getUserRecord(userID);
    return fullUserInfo;
  }

  async getFullUserInfo(userID: Schema.Types.ObjectId): Promise<IUserInfoDTO> {
    const fullUserInfo = await this.getUserRecord(userID).populate(
      "registeredCourses.data"
    );
    return fullUserInfo;
  }

  private getUserRecord(
    userID: Schema.Types.ObjectId
  ): DocumentQuery<any, any> {
    const userRecord = this.userModel.findById(userID).select("-password");
    userRecord.then(record => {
      if (!record) {
        throw createError(401, "User not found");
      }
    });
    return userRecord;
  }

  async insertNewCourses(
    courseToSaveInUserDB: RegisteredCourse[],
    userID: Schema.Types.ObjectId
  ): Promise<IUserInfoDTO> {
    return await this.userModel.update(
      { _id: userID },
      {
        $push: {
          registeredCourses: {
            $each: courseToSaveInUserDB
          }
        }
      }
    );
  }
}
