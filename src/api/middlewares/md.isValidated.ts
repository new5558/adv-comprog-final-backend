import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import createError from "http-errors";

export default (req: Request, _: Response, next: NextFunction) => {
  const validationErrors = validationResult(req).formatWith(
    ({ location, msg, param, nestedErrors }) => {
      return { location, msg, param, nestedErrors };
    }
  );
  if (!validationErrors.isEmpty()) {
    return next(createError(422, { errors: validationErrors.array() }));
  }
  return next();
};
