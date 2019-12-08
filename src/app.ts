// const express = require('express')
import express from "express";
import routes from "./api/index";
import mongoose from "mongoose";
import cors from 'cors'

mongoose.connect("mongodb://localhost:27017/testdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on("error", err => {
  console.log("err", err);
});
mongoose.connection.on("connected", (err, res) => {
  console.log("mongoose is connected");
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.listen(3000, () => {
  console.log("Start server at port 3000.");
});

app.use(routes);
