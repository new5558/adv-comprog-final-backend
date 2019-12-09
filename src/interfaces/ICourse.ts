import Schema from 'mongoose';
import { Semester, Degree, StudentType } from './ICommon';

export interface ICourse {
    _id: Schema.Types.ObjectId;
    year: string;
    semester: Semester;
    number: string;
    midtermDate: Date;
    finalDate: Date;
    name: string;
    shortName: string;
    engName: string;
    studentType: StudentType;
    faculty: number;
    requirement: Schema.Types.ObjectId[];
    credit: number;
    section: Section[];
    degree: Degree;
}

export interface Section {
    startTime: Date;
    endTime: Date;
    room: string;
    building: String;
    instructor: string;
    capacity: number;
    enrolledStudent: Schema.Types.ObjectId[]
}