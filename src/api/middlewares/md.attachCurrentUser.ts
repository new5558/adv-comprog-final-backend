import UserModel from "../../models/user";
import { Request, Response, NextFunction } from "express";

export default async (req: Request, res: Response, next: NextFunction) => {
  const { decodedUser } = req;
  const userRecord =
    decodedUser &&
    (await UserModel.findById(decodedUser.data._id).select("-password"));
  req.currentUser = userRecord;
  if (!userRecord) {
    return res.status(401).end("User not found");
  } else {
    return next();
  }
};
