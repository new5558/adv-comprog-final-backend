import { Schema, Document } from "mongoose";
import { Semester } from "./ICommon";

export interface IAcademicYear extends Document {
  year: string;
  semester: Semester;
  startDate: Date;
  endDate: Date;
  registrationStartDate: Date;
  registrationEndDate: Date;
  withdrawalStartDate: Date;
  withdrawalEndDate: Date;
}

export interface IAcademicYearDTO {
  year: IAcademicYear["year"];
  semester: IAcademicYear["semester"];
  startDate: IAcademicYear["startDate"];
  endDate: IAcademicYear["endDate"];
  registrationStartDate: IAcademicYear["registrationStartDate"];
  registrationEndDate: IAcademicYear["registrationEndDate"];
  withdrawalStartDate: IAcademicYear["withdrawalStartDate"];
  withdrawalEndDate: IAcademicYear["withdrawalEndDate"];
}
