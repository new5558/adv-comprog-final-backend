import { Schema, Document } from "mongoose";
import { Semester } from "./ICommon";

export interface IAcademicYear extends Document {
  _id: Schema.Types.ObjectId;
  order: number;
  year: string;
  semester: Semester;
  startDate: Date;
  endDate: Date;
  registrationStartDate: Date;
  registrationEndDate: Date;
  withdrawalStartDate: Date;
  withdrawalEndDate: Date;
}

export interface IAcademicYearInputDTO {
  year: IAcademicYear["year"];
  semester: IAcademicYear["year"];
  startDate: IAcademicYear["year"];
  endDate: IAcademicYear["year"];
  registrationStartDate: IAcademicYear["registrationStartDate"];
  registrationEndDate: IAcademicYear["registrationEndDate"];
  withdrawalStartDate: IAcademicYear["withdrawalStartDate"];
  withdrawalEndDate: IAcademicYear["withdrawalEndDate"];
}
