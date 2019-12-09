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
      __: Response,
      next: NextFunction
    ) => {
      if (process.env.NODE_ENV !== "production") {
        console.log(error);
      }
      if (error instanceof SyntaxError) {
        if (error.status === 400 && "body" in error) {
          return next(createError(400, "Bad Request"));
        }
        return next(createError(500, "Internal Server Error"));
      }
      return next();
    }
  );
  return app;
};
