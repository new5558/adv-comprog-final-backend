import { Router, Request, Response, NextFunction } from "express";
import AuthService from "../../services/service.auth";
import { Container } from "typedi";
import isValidated from "../middlewares/md.isValidated";
import isAuthenticated from "../middlewares/md.isAuthenticated";
import attachCurrentUser from "../middlewares/md.attachCurrentUser";
import requiredRole from "../middlewares/md.requiredRole";
import { loginValidator, signupValidator } from "../middlewares/md.validators";
import { wrapCatch } from "../../helpers/utils";

const router = Router();

export default (app: Router) => {
  app.use("/auth", router);

  router.post(
    "/login",
    loginValidator(),
    isValidated,
    wrapCatch(async (req: Request, res: Response, next: NextFunction) => {
      const { body } = req;
      const { username, password } = body;
      try {
        const result = await Container.get(AuthService).login(
          username,
          password
        );
        return res.status(200).json(result);
      } catch (e) {
        return next(e);
      }
    })
  );

  router.post(
    "/signup",
    signupValidator(),
    isValidated,
    isAuthenticated,
    attachCurrentUser,
    requiredRole("admin"),
    wrapCatch(async (req: Request, res: Response, next: NextFunction) => {
      const { body } = req;
      try {
        const result = await Container.get(AuthService).signup(body);
        return res.status(200).send(result);
      } catch (e) {
        return next(e);
      }
    })
  );
};
