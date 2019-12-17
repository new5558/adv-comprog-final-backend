import mongoose, { Schema } from "mongoose";
import { ICourse } from "../interfaces/ICourse";

const CourseSchema = new mongoose.Schema({
  uuid: String,
  year: String,
  semester: Number,
  courseNumber: String,
  midtermDate: Date,
  finalDate: Date,
  name: String,
  shortName: String,
  engName: String,
  studentType: Number,
  faculty: Number,
  requirement: [
    {
      data: {
        type: Schema.Types.ObjectId,
        ref: "course"
      },
      uuid: String
    }
  ],
  credit: Number,
  requiredDegree: Number,
  section: [
    {
      sectionNumber: Number,
      startTime: Date,
      endTime: Date,
      room: String,
      building: String,
      instructor: String,
      capacity: String,
      enrolledStudent: [Schema.Types.ObjectId]
    }
  ]
});

export default mongoose.model<ICourse>("course", CourseSchema, "courses");
