import mongoose, { Schema } from "mongoose";
import { IAcademicYear } from "../interfaces/IAcademicYear";

const AcademicYearSchema = new Schema({
  _id: Schema.Types.ObjectId,
  order: Number,
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
