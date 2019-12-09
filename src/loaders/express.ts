
import cors from 'cors';
import express from 'express';

declare global {
  namespace Express {
    interface Request {
      decodedUser: any;
      currentUser: any;
    }
  }
}

export default ({ app }: any) => {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded());
  return app;
};
