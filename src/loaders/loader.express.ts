import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import createError from "http-errors";

declare global {
  namespace Express {
    interface Request {
      decodedUser: any;
      currentUser: any;
    }
  }
}

export default ({ app }: any) => {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded());

  app.use(
    (
      error: createError.HttpError,
      _: Request,
      res: Response,
      next: NextFunction
    ) => {
      if (error instanceof SyntaxError) {
        next(createError(400, "Bad Request"));
      } else {
        next();
      }
    }
  );
  return app;
};
