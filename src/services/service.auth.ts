import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../models/user";
import { IUser, IUserInputDTO } from "../interfaces/IUser";
import { Service } from "typedi";
import createError from "http-errors";

@Service()
export default class AuthService {
  constructor() {}

  public async signup(userInfo: IUserInputDTO): Promise<any> {
    const { username, password, name, role } = userInfo;
    const userRecord = await UserModel.findOne({ username });
    if (userRecord) {
      return createError(409, "User already exists");
    }
    {
      const salt = bcrypt.genSaltSync(10);
      const passwordHashed = bcrypt.hashSync(password, salt);
      const userRecord = await UserModel.create({
        password: passwordHashed,
        username,
        role,
        salt,
        name
      });
      await userRecord.save();
      return {
        user: {
          email: userRecord.username,
          name: userRecord.name,
          role: userRecord.role,
          _id: userRecord._id
        }
      };
    }
  }

  public async login(username: string, password: string): Promise<any> {
    const userRecord = await UserModel.findOne({ username });
    if (!userRecord) {
      return createError(404, "User not found");
    }
    const isPasswordValid = bcrypt.compareSync(password, userRecord.password);
    if (!isPasswordValid) {
      return createError(401, "Incorrect password");
    }
    return {
      user: {
        username: userRecord.username,
        name: userRecord.name,
        role: userRecord.role
      },
      token: this.generateJWT(userRecord)
    };
  }

  private generateJWT(user: IUser) {
    const data = {
      _id: user._id,
      name: user.name,
      username: user.username
    };
    const signature = process.env.SECRET as string;
    const expiration = "2h";

    return jwt.sign({ data }, signature, { expiresIn: expiration });
  }
}
