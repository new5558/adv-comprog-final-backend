import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const getTokenFromHeader = (req: Request) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }
};

export default (req: Request, res: Response, next: NextFunction) => {
  const token = getTokenFromHeader(req);
  const decodedUser = token && jwt.verify(token, process.env.SECRET as string);
  console.log(decodedUser, 'decodeUser');
  if (!decodedUser) {
    res.status(401).send("Unauthorized");
  } else {
    req.decodedUser = decodedUser;
    next();
  }
};
