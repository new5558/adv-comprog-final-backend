require("dotenv").config({ path: "src/config/.env" });
import express from "express";
import "reflect-metadata";
import loader from "./loaders/index";

async function startServer() {
  const app = express();
  await loader({ expressApp: app });

  app.listen(3100, () => {
    console.log("Start server at port 3100.");
  });
}

startServer();
