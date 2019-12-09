import { Router, Request, Response, Express } from "express";
import auth from "./routes/route.auth";
import user from "./routes/route.users";
import listEndpoints from "express-list-endpoints";

const router = Router();

router.all("/endpoints", (_: Request, res: Response) => {
  res.status(200).json({
    endpoints: listEndpoints(router as Express)
  });
});

auth(router);
user(router);

router.get("/", (_: Request, res: Response) => {
  res.status(200).json({ value: "Server works" });
});

export default router;
