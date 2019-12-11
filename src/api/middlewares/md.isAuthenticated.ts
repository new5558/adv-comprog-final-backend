import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import createError from "http-errors";
import config from "../../config";

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
      const decodedUser = jwt.verify(token, config.secret as string);
      req.decodedUser = decodedUser && (decodedUser as any).data;
      return next();
    } catch {
      return next(createError(401, "Unauthorized"));
    }
  }
  return next(createError(401, "Unauthorized"));
};
