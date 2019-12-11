import mongoose from "mongoose";
import config from "../config";

export default async () => {
  const connection = await mongoose.connect(
    config.databaseURL as string,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );
  mongoose.connection.on("error", err => {
    console.log("err", err);
  });
  mongoose.connection.on("connected", (_, __) => {
    console.log("mongoose is connected");
  });
  return connection.connection.db;
};
