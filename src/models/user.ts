import mongoose from 'mongoose';
import { IUser } from '../interfaces/IUser';

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
})

export default mongoose.model<IUser & mongoose.Document>('user', UserSchema, 'users');