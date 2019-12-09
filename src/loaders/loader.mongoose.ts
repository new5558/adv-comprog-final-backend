import mongoose from "mongoose";

export default async () => {
  const connection = await mongoose.connect(
    process.env.databaseURL as string,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );
  mongoose.connection.on("error", err => {
    console.log("err", err);
  });
  mongoose.connection.on("connected", (err, res) => {
    console.log("mongoose is connected");
  });
  return connection.connection.db;
};
