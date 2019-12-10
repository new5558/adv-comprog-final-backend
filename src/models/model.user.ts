import mongoose from "mongoose";
import { IUser } from "../interfaces/IUser";

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String,
  role: String,
  faculty: Number,
  major: String,
  studentType: Number,
  degree: Number,
  registeredCourses: [
    { uuid: String, grade: Number, status: Number }
  ]
});

export default mongoose.model<IUser>("user", UserSchema, "users");
