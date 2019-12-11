import express from "express";
import "reflect-metadata";
import loader from "./loaders/index";
import config from "./config";

async function startServer() {
  const app = express();
  await loader({ expressApp: app });

  app.listen(config.port, () => {
    console.log("Start server at port 3100.");
  });
}

startServer();
