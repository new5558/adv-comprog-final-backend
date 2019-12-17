import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUser, IUserInputDTO, IUserInfoDTO } from "../interfaces/IUser";
import { Service, Inject } from "typedi";
import createError from "http-errors";
import UserDataService from "../data-services/db.service.user";
import config from "../config";
import { modelToObj, cleanRegisterdCourses } from "../helpers/utils";

@Service()
export default class AuthService {
  @Inject("userDataService")
  userDataService: UserDataService;

  public async signup(userInfo: IUserInputDTO): Promise<any> {
    const { username, password } = userInfo;
    const existingUserRecord = await this.userDataService.findUserByUsername(
      username
    );
    if (existingUserRecord) {
      throw createError(409, "User already exists");
    }
    const salt = bcrypt.genSaltSync(10);
    const passwordHashed = bcrypt.hashSync(password, salt);
    const userRecord = await this.userDataService.createUser(
      userInfo,
      passwordHashed
    );
    await userRecord.save();
    return {
      message: "Create user success",
      user: {
        username: userRecord.username,
        name: userRecord.name,
        role: userRecord.role
      }
    };
  }

  public async signupMany(userInfos: IUserInputDTO[]): Promise<IUser[]> {
    const userHashedInfos = await Promise.all(
      userInfos.map(async userInfo => {
        const { username, password } = userInfo;
        const existingUserRecord = await this.userDataService.findUserByUsername(
          username
        );
        if (existingUserRecord) {
          throw createError(409, "User already exists");
        }
        const salt = bcrypt.genSaltSync(10);
        userInfo.password = bcrypt.hashSync(password, salt);
        return userInfo;
      })
    );
    return await this.userDataService.createManyUsers(userHashedInfos);
  }

  public async login(username: string, password: string): Promise<any> {
    const userRecord = await this.userDataService.findUserByUsername(username);
    if (!userRecord) {
      throw createError(404, "User not found");
    }
    const isPasswordValid = bcrypt.compareSync(password, userRecord.password);
    if (!isPasswordValid) {
      throw createError(401, "Incorrect password");
    }
    (userRecord as any).password = undefined;
    const fullUserInfo = modelToObj<IUserInfoDTO>(userRecord) as IUserInfoDTO;
    fullUserInfo.registeredCourses = cleanRegisterdCourses(
      fullUserInfo.registeredCourses
    );
    return {
      user: fullUserInfo,
      token: this.generateJWT(userRecord)
    };
  }

  private generateJWT(user: IUser) {
    const data = {
      _id: user._id,
      name: user.name,
      username: user.username
    };
    const signature = config.secret as string;
    const expiration = "2h";

    return jwt.sign({ data }, signature, { expiresIn: expiration });
  }
}
