import { Schema, Document } from "mongoose";
import { Semester, StudentType, RequiredDegree } from "./ICommon";
import { Dictionary } from "lodash";

export interface ICourse extends Document {
  _id: Schema.Types.ObjectId;
  uuid: string;
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
  requirement: string[]; //uuid of required course
  credit: number;
  section: Section[];
  requiredDegree: RequiredDegree;
}

export interface ICourseInputDTO {
  uuid: ICourse["uuid"];
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
  requiredDegree: ICourse["requiredDegree"];
}

export interface ICourseRegisterDTO {
  uuid: ICourse["uuid"];
  sectionNumber: Section["sectionNumber"];
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

export interface CourseToRegisterBySections
  extends Dictionary<
    (ICourse & {
      sectionNumber: number;
    })[]
  > {}

export interface CourseUnioned extends ICourse {
  sectionNumber: number;
}
