require("dotenv").config({ path: "src/config/.env" });
import express from "express";
import routes from "./api/index";
import "reflect-metadata";
import loader from './loaders/index';

async function startServer() {
  const app = express();
  await loader({ expressApp: app });
  app.listen(3000, () => {
    console.log("Start server at port 3000.");
  });
  app.use(routes);
}

startServer();