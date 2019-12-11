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
      const result = await Container.get(AuthService).login(username, password);
      res.status(200).json(result);
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
      const result = await Container.get(AuthService).signup(body);
      res.status(200).send(result);
    })
  );
};
