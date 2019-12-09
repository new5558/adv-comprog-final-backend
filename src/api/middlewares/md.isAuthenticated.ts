import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import createError from "http-errors";

const getTokenFromHeader = (req: Request) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }
};

export default (req: Request, _: Response, next: NextFunction) => {
  const token = getTokenFromHeader(req);
  if (token) {
    try {
      const decodedUser = jwt.verify(token, process.env.SECRET as string);
      req.decodedUser = decodedUser;
      return next();
    } catch {
      return next(createError(401, "Unauthorized"));
    }
  }
  return next(createError(401, "Unauthorized"));
};
