import { Schema, Document } from "mongoose";
import {Degree, StudentType, Role, Grade, CourseUserStatus} from './ICommon';
import { ICourse } from "./ICourse";


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
  registeredCourses: RegisteredCourse[];
}

export interface RegisteredCourse {
  data: ICourse & Schema.Types.ObjectId;
  sectionNumber: number;
  grade: Grade;
  status: CourseUserStatus;
}

export interface IUserInfoDTO {
  _id: Schema.Types.ObjectId;
  name: IUser['name'];
  role: IUser['role'];
  username: IUser['username'];
  faculty: IUser['faculty'];
  major: IUser['major'];
  studentType: IUser['studentType'];
  degree: IUser['degree'];
  registeredCourses: IUser['registeredCourses'];
}

export interface IUserInputDTO {
  name: IUser['name'];
  role: IUser['role'];
  username: IUser['username'];
  password: IUser['password'];
  faculty: IUser['faculty'];
  major: IUser['major'];
  studentType: IUser['studentType'];
  degree: IUser['degree'];
  registeredCourses: IUser['registeredCourses'];
}

export interface IUserDecodedDTO {
    _id: IUser['_id'];
    name: IUser['name'];
    username: IUser['username'];
}
