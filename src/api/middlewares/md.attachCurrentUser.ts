import { Request, Response, NextFunction } from "express";
import { wrapCatch } from "../../helpers/utils";
import UserDataService from "../../data-services/db.service.user";
import Container from "typedi";

export default wrapCatch(
  async (req: Request, _: Response, next: NextFunction) => {
    const { decodedUser } = req;
    req.currentUser = await Container.get(UserDataService).getUserInfo(
      decodedUser._id
    );
    next();
  }
);
