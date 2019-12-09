require("dotenv").config({ path: "src/config/.env" });
import express, { Request, Response, NextFunction } from "express";
import routes from "./api/index";
import "reflect-metadata";
import loader from "./loaders/index";
import createError from "http-errors";

async function startServer() {
  const app = express();
  await loader({ expressApp: app });
  app.use(routes);

  app.use((_: Request, __: Response, next: NextFunction) => {
    next(createError(404, "Not Found"));
  });

  app.use(
    (
      error: createError.HttpError,
      _: Request,
      res: Response,
      __: NextFunction
    ) => {
      res.status(error.status).send(error);
    }
  );

  app.listen(3100, () => {
    console.log("Start server at port 3100.");
  });
}

startServer();
