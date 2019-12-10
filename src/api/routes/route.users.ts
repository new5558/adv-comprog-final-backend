import express, {Request, Response, NextFunction, Router} from "express";
import isAuthenticated from "../middlewares/md.isAuthenticated";
import attachCurrentUser from '../middlewares/md.attachCurrentUser';
import createError from 'http-errors';
import Container from "typedi";
import UserService from '../../services/service.user';

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

  router.post("/register", (req: Request, res: Response, next: NextFunction) => {
    Container.get(UserService);
    next(createError(501, "Not Implemented"));
  })

  router.get("/register/results", (req: Request, res: Response, next: NextFunction) => {
    next(createError(501, "Not Implemented"));
  })

  router.get("/grade", (req: Request, res: Response, next: NextFunction) => {
    next(createError(501, "Not Implemented"));
  })

  router.post("/widthdraw", (req: Request, res: Response, next: NextFunction) => {
    next(createError(501, "Not Implemented"));
  })
};
