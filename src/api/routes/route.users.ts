import * as express from "express";
import isAuthenticated from "../middlewares/md.isAuthenticated";
import attachCurrentUser from '../middlewares/md.attachCurrentUser';

const router = express.Router();

export default (app: express.Router) => {
  app.use("/user", router);

  router.get(
    "/user",
    isAuthenticated,
    attachCurrentUser,
    (req: express.Request, res: express.Response) => {
      res.status(200).json(req.currentUser);
    }
  );
};
