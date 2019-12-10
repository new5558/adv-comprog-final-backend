import { Schema, Document } from "mongoose";
import {Degree, StudentType, Role} from './ICommon';

export interface IUser extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  username: string;
  password: string;
  role: Role;
  salt: string;
  faculty: number;
  major: string;
  studentType: StudentType;
  degree: Degree;
  registeredCourse: Schema.Types.ObjectId[];
}

export interface IUserInputDTO {
  name: string;
  role: string;
  username: string;
  password: string;
  faculty: number;
  major: string;
  studentType: StudentType;
  degree: Degree;
  registeredCourse: Schema.Types.ObjectId[];
}
