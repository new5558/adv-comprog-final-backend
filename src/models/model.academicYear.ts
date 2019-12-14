import mongoose, { Schema } from "mongoose";
import { IAcademicYear } from "../interfaces/IAcademicYear";

const AcademicYearSchema = new Schema({
  year: String,
  semester: Number,
  startDate: Date,
  endDate: Date,
  registrationStartDate: Date,
  registrationEndDate: Date,
  withdrawalStartDate: Date,
  withdrawalEndDate: Date
});

export default mongoose.model<IAcademicYear>(
  "academicYear",
  AcademicYearSchema,
  "academicYears"
);
