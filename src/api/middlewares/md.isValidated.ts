import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator/check";
import createError from "http-errors";

export default (req: Request, res: Response, next: NextFunction) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return createError(422, validationErrors)
  }
  return next();
};
