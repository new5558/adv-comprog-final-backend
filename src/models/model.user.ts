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
  registeredCourses: [
    { data: {type: Schema.Types.ObjectId, ref: 'course'}, grade: Number, status: Number }
  ]
});

// UserSchema.virtual('registeredCourses.info', {
//   ref: 'course', // The model to use
//   localField: 'registeredCourses.uuid', // Find people where `localField`
//   foreignField: 'uuid', // is equal to `foreignField`
//   // If `justOne` is true, 'members' will be a single doc as opposed to
//   // an array. `justOne` is false by default.
//   // justOne: false,
//   // options: { sort: { name: -1 }, limit: 5 } // Query options, see http://bit.ly/mongoose-query-options
// });

export default mongoose.model<IUser>("user", UserSchema, "users");
