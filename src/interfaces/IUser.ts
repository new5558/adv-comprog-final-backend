import { Schema, Document } from "mongoose";
import {Degree, StudentType, Role, Grade, CourseUserStatus} from './ICommon';
import { ICourse } from "./ICourse";


export interface IUser extends Document {
  name: string;
  username: string;
  password: string;
  role: string;
  faculty: number;
  major: string;
  studentType: StudentType;
  degree: Degree;
  registeredCourses: RegisteredCourse[];
}

export interface RegisteredCourse {
  data?: ICourse | Schema.Types.ObjectId;
  uuid?: string;
  sectionNumber: number;
  grade: Grade;
  status: CourseUserStatus;
}

export interface IUserInfoDTO {
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

export interface IUserGrade {
    year: ICourse['year'];
    semester: ICourse['semester'];
    courseNumber: ICourse['courseNumber'];
    engName: ICourse['engName'];
    credit: ICourse['credit'];
    grade: RegisteredCourse['grade'];
}
