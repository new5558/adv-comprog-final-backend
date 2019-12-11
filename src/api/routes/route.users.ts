import express, { Request, Response, NextFunction, Router } from "express";
import isAuthenticated from "../middlewares/md.isAuthenticated";
import Container from "typedi";
import RegistrationService from "../../services/service.registration";
import {
  registerValidator,
  withdrawValidator
} from "../middlewares/md.validators";
import isValidated from "../middlewares/md.isValidated";
import { wrapCatch } from "../../helpers/utils";
import UserService from "../../services/service.user";
import createPDF from "../../helpers/utils.pdf";

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
      const result = await Container.get(RegistrationService).register(
        body,
        decodedUser._id
      );
      res.status(200).json(result);
    })
  );

  router.get(
    "/register/result",
    isAuthenticated,
    wrapCatch(async (req: Request, res: Response) => {
      const { decodedUser } = req;
      const registerResult = await Container.get(
        RegistrationService
      ).getRegistrationResult(decodedUser._id);
      res.status(200).json(registerResult);
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
    "/grade",
    isAuthenticated,
    wrapCatch(async (req: Request, res: Response, next: NextFunction) => {
      const { decodedUser } = req;
      const userGrades = await Container.get(UserService).getGrades(
        decodedUser._id
      );
      res.status(200).json(userGrades);
    })
  );

  router.post(
    "/withdraw",
    withdrawValidator(),
    isValidated,
    isAuthenticated,
    wrapCatch(async (req: Request, res: Response, next: NextFunction) => {
      const { decodedUser, body } = req;
      const withdrawalResult = await Container.get(
        RegistrationService
      ).withdraw(decodedUser._id, body);
      const buffer = await createPDF(withdrawalResult);
      res.contentType("application/pdf");
      res.send(buffer);
    })
  );
};
