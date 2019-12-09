import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator/check";

export default (req: Request, res: Response, next: NextFunction) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    res.status(422).json(validationErrors);
  } else {
    next();
  }
};
