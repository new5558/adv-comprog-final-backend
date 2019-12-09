import { Router, Request, Response } from "express";
import AuthService from "../../services/service.auth";
import { Container } from "typedi";
import { body } from "express-validator";
import isValidated from "../middlewares/md.isValidator";
import isAuthenticated from "../middlewares/md.isAuthenticated";
import attachCurrentUser from "../middlewares/md.attachCurrentUser";
import requiredRole from "../middlewares/md.requiredRole";

const router = Router();

export default (app: Router) => {
  app.use("/auth", router);

  router.post(
    "/login",
    body("username")
      .isString()
      .isLength({ min: 10, max: 10 })
      .trim()
      .escape(),
    body("password")
      .isString()
      .trim()
      .escape(),
    isValidated,
    async (req: Request, res: Response) => {
      const { body } = req;
      const { username, password } = body;
      try {
        const result = await Container.get(AuthService).login(
          username,
          password
        );
        if (result.user) {
          res.status(200).json(result);
        } else {
          res.status(500).send();
        }
      } catch (e) {
        res.status(401).send(e + "");
      }
    }
  );

  router.post(
    "/signup",
    body("username")
      .isString()
      .isLength({ min: 10, max: 10 })
      .trim()
      .escape(),
    body("password")
      .isString()
      .isLength({ min: 8 })
      .trim()
      .escape(),
    body("name")
      .isString()
      .trim()
      .escape(),
    body("role")
      .isString()
      .trim()
      .escape(),
    isValidated,
    isAuthenticated,
    attachCurrentUser,
    requiredRole("admin"),
    async (req: Request, res: Response) => {
      const { body } = req;
      try {
        const result = await Container.get(AuthService).signup(body);
        res.status(200).send(result);
      } catch (e) {
        res.status(401).send(e);
      }
    }
  );
};
