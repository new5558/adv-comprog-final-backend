import express, { Request, Response, NextFunction, Router } from "express";
import isAuthenticated from "../middlewares/md.isAuthenticated";
import attachCurrentUser from "../middlewares/md.attachCurrentUser";
import createError from "http-errors";
import Container from "typedi";
import UserService from "../../services/service.user";
import { registerValidator } from "../middlewares/md.validators";
import isValidated from "../middlewares/md.isValidated";

const router = express.Router();

export default (app: Router) => {
  app.use("/user", router);

  router.get(
    "/",
    isAuthenticated,
    attachCurrentUser,
    (req: Request, res: Response) => {
      res.status(200).json(req.currentUser);
    }
  );

  router.post(
    "/register",
    registerValidator(),
    isValidated,
    isAuthenticated,
    attachCurrentUser,
    async (req: Request, res: Response, next: NextFunction) => {
      const { body, currentUser } = req;
      try {
        const result = await Container.get(UserService).register(
          body,
          currentUser
        );
      } catch (e) {
        console.log(e);
      }
      next(createError(501, "Not Implemented"));
    }
  );

  router.get(
    "/register/results",
    (req: Request, res: Response, next: NextFunction) => {
      next(createError(501, "Not Implemented"));
    }
  );

  router.get("/grade", (req: Request, res: Response, next: NextFunction) => {
    next(createError(501, "Not Implemented"));
  });

  router.post(
    "/widthdraw",
    (req: Request, res: Response, next: NextFunction) => {
      next(createError(501, "Not Implemented"));
    }
  );
};
