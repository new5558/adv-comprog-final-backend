import UserModel from "../../models/user";
import * as express from "express";

export default async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { decodedUser } = req;
  const userRecord = decodedUser && (await UserModel.findById(decodedUser.data._id).select("-password"));
  req.currentUser = userRecord;
  if (!userRecord) {
    return res.status(401).end("User not found");
  } else {
    return next();
  }
};
