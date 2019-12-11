import express, { Request, Response, NextFunction, Router } from "express";
import isAuthenticated from "../middlewares/md.isAuthenticated";
import createError from "http-errors";
import Container from "typedi";
import RegistrationsService from "../../services/service.registration";
import { registerValidator } from "../middlewares/md.validators";
import isValidated from "../middlewares/md.isValidated";
import { wrapCatch } from "../../helpers/utils";
import UserService from "../../services/service.user";

const router = express.Router();

export default (app: Router) => {
  app.use("/user", router);

  router.get(
    "/",
    isAuthenticated,
    wrapCatch(async (req: Request, res: Response) => {
      const { decodedUser } = req;
      const fullUserInfo = await Container.get(UserService).getFullUserInfo(
        decodedUser._id
      );
      res.status(200).json(fullUserInfo);
    })
  );

  router.post(
    "/register",
    registerValidator(),
    isValidated,
    isAuthenticated,
    wrapCatch(async (req: Request, res: Response, next: NextFunction) => {
      const { body, decodedUser } = req;
      const result = await Container.get(RegistrationsService).register(
        body,
        decodedUser._id
      );
      res.status(200).json(result);
    })
  );

  router.get(
    "/info",
    isAuthenticated,
    wrapCatch(async (req: Request, res: Response) => {
      const { decodedUser } = req;
      const fullUserInfo = await Container.get(UserService).getUserInfo(
        decodedUser._id
      );
      res.status(200).json(fullUserInfo);
    })
  );

  router.get(
    "/courses",
    isAuthenticated,
    wrapCatch(async (req: Request, res: Response) => {
      const { decodedUser } = req;
      const fullUserInfo = await Container.get(UserService).getCourses(
        decodedUser._id
      );
      res.status(200).json(fullUserInfo);
    })
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
