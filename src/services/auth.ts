import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../models/user";
import { IUser, IUserInputDTO } from "../interfaces/IUser";

export default class AuthService {
  constructor() {}

  public async signup(userInfo: IUserInputDTO): Promise<any> {
    const { username , password, name} = userInfo;
    const salt = bcrypt.genSaltSync(10);
    const passwordHashed = bcrypt.hashSync(password, salt);
    const userRecord = await UserModel.create({
      password: passwordHashed,
      username,
      salt,
      name
    });
    // @Todo abstract mmongoDB opreation from auth service
    userRecord.save();
    return {
      user: {
        email: userRecord.username,
        name: userRecord.name
      }
    };
  }

  public async login(username: string, password: string): Promise<any> {
    const userRecord = await UserModel.findOne({ username });
    if (!userRecord) {
      throw new Error("User not found");
    } else {
      const correctPassword = bcrypt.compareSync(
        password,
        userRecord.password
      );
      if (!correctPassword) {
        throw new Error("Incorrect password");
      }
    }

    return {
      user: {
        usernmae: userRecord.username,
        name: userRecord.name
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
    // @Todo: set this to environment
    const signature = "MySuP3R_z3kr3t";
    const expiration = "2h";

    return jwt.sign({ data }, signature, { expiresIn: expiration });
  }
}
