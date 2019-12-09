import cors from "cors";
import express, { Request, Response, NextFunction } from "express";

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

  app.use((error: any, _: Request, res: Response, next: NextFunction) => {
    if (error instanceof SyntaxError) {
      res.status(400).send("SyntaxError");
    } else {
      next();
    }
  });

  return app;
};
