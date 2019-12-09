import mongoose, { Schema } from "mongoose";
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
  registeredCourse: [Schema.Types.ObjectId]
});

export default mongoose.model<IUser & mongoose.Document>(
  "user",
  UserSchema,
  "users"
);
