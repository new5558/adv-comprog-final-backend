import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import routes from "../api/index";
import createError, { HttpError } from "http-errors";
import config from "../config";

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
  app.use(express.urlencoded({ extended: true }));
  app.set('views', './src/views');
  app.set('view engine', 'ejs');
  app.use(routes);

  app.use((error: HttpError, _: Request, __: Response, next: NextFunction) => {
    if (config.env !== "production") {
      console.log(error);
    }
    if (error instanceof HttpError) {
      return next(error);
    }
    if (
      error instanceof SyntaxError &&
      error.status === 400 &&
      "body" in error
    ) {
      return next(createError(400, "Bad Request"));
    }
    return next(createError(500, "Internal Server Error"));
  });

  app.use((_: Request, __: Response, next: NextFunction) => {
    next(createError(404, "Not Found"));
  });

  app.use((error: HttpError, _: Request, res: Response, __: NextFunction) => {
    res.status(error.status).send(error);
  });
  return app;
};
