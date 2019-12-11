import { Request, Response, NextFunction } from "express";
import _ from "lodash";

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
