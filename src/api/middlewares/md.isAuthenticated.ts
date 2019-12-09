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
  if (token) {
    try {
      const decodedUser = jwt.verify(token, process.env.SECRET as string);
      req.decodedUser = decodedUser;
      next();
    } catch {
      res.status(401).send("Unauthorized");
    }
  } else {
    res.status(401).send("Unauthorized");
  }
};
