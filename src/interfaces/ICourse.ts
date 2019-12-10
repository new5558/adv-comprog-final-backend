import { Schema, Document } from "mongoose";
import { Semester, StudentType, RequiredDegree } from "./ICommon";

export interface ICourse extends Document {
  _id: Schema.Types.ObjectId;
  year: string;
  semester: Semester;
  courseNumber: string;
  midtermDate: Date;
  finalDate: Date;
  name: string;
  shortName: string;
  engName: string;
  studentType: StudentType;
  faculty: number;
  requirement: Schema.Types.ObjectId[];
  credit: number;
  section: Section[];
  degree: RequiredDegree;
}

export interface ICourseInputDTO {
  year: ICourse["year"];
  semester: ICourse["semester"];
  courseNumber: ICourse["courseNumber"];
  midtermDate: ICourse["midtermDate"];
  finalDate: ICourse["finalDate"];
  name: ICourse["name"];
  shortName: ICourse["shortName"];
  engName: ICourse["engName"];
  studentType: ICourse["studentType"];
  faculty: ICourse["faculty"];
  requirement: ICourse["requirement"];
  credit: ICourse["credit"];
  section: ICourse["section"];
  degree: ICourse["degree"];
}

export interface ICourseRegisterDTO {
  _id: ICourse["_id"];
  year: ICourse["year"];
  semester: ICourse["semester"];
  courseNumber: ICourse["courseNumber"];
  sectionNumber: Section["sectionNumber"];
  credit: ICourse["credit"];
}

export interface Section {
  sectionNumber: number;
  startTime: Date;
  endTime: Date;
  room: string;
  building: String;
  instructor: string;
  capacity: number;
  enrolledStudent: Schema.Types.ObjectId[];
}
