import mongoose, { Schema } from "mongoose";
import { ICourse } from "../interfaces/ICourse";

const CourseSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  year: String,
  semester: Number,
  number: String,
  midtermDate: Date,
  finalDate: Date,
  name: String,
  shortName: String,
  engName: String,
  studentType: Number,
  faculty: Number,
  requirement: [Schema.Types.ObjectId],
  credit: Number,
  section: [
    {
      startTime: Date,
      endTime: Date,
      room: String,
      building: String,
      instructor: String,
      capacity: String,
      enrolledStudent: [Schema.Types.ObjectId]
    }
  ],
  degree: Number
});

export default mongoose.model<ICourse & mongoose.Document>(
  "course",
  CourseSchema,
  "courses"
);
