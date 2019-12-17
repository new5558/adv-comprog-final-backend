import { Request, Response, NextFunction } from "express";
import _ from "lodash";
import { Schema, MongooseDocument } from "mongoose";
import { RegisteredCourse } from "../interfaces/IUser";

export const wrapCatch = (fn: any) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

export const unionByKey = (arr1: any, arr2: any, key: string) => {
  return _(arr1)
    .keyBy(key)
    .merge(_.keyBy(arr2, key))
    .values()
    .value();
};

// export const compareObjectID = (
//   id1: Schema.Types.ObjectId,
//   id2: Schema.Types.ObjectId
// ) => {
//   return JSON.stringify(id1) === JSON.stringify(id2);
// };

export const modelToObj = <T>(model: MongooseDocument | null): null | T => {
  if (model === null) {
    return null;
  }
  const objModel = model.toObject();
  objModel._id = undefined;
  objModel.__v = undefined;
  return objModel as T;
};

export const cleanModels = <T>(models: MongooseDocument[]): T[] => {
  return models.map(model => {
    return modelToObj<T>(model) as T;
  });
};

export const cleanRegisterdCourses = (
  courses: RegisteredCourse[]
): RegisteredCourse[] => {
  return courses.map(course => {
    course.data = undefined;
    (course as any)._id = undefined;
    return course;
  });
};
