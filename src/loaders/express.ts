
import cors from 'cors';
import express from 'express';

export default ({ app }: any) => {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded());
  return app;
};
