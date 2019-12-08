require("dotenv").config({ path: "src/config/.env" });
import express from "express";
import routes from "./api/index";
import "reflect-metadata";

async function startServer() {
  const app = express();
  await require('./loaders').default({ expressApp: app });
  app.listen(3000, () => {
    console.log("Start server at port 3000.");
  });
  app.use(routes);
}

startServer();