import {Schema, Document} from 'mongoose';
import { Semester, Degree, StudentType } from './ICommon';

export interface ICourse extends Document {
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

export interface ICourseInputDTO {
    year: string;
    semester: Semester;
    courseNumber: string;
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

export interface ICourseRegisterDTO {
    year: string;
    semester: Semester;
    courseNumber: string;
    sectionNumber: number;
}

export interface Section {
    sectionNumber: number;
    startTime: Date;
    endTime: Date;
    room: string;
    building: String;
    instructor: string;
    capacity: number;
    enrolledStudent: Schema.Types.ObjectId[]
}