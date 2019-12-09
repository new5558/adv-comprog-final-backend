import { Request, Response, NextFunction } from "express";

export default (role: string) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { currentUser } = req;
  if (currentUser && currentUser.role == role) {
    next();
  } else {
    res.status(401).send("Action not allowed");
  }
};
