import { Request, Response, NextFunction } from "express";
import createError from "http-errors";

export default (role: string) => (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { currentUser } = req;
  if (currentUser && currentUser.role == role) {
    return next();
  }
  return createError(401, "Action not allowed");
};
