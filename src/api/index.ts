import { Router, Request, Response } from "express";
import AuthService from "../services/auth";
import { Container } from "typedi";

const router = Router();
router.get("/", (req: Request, res: Response) => {
  res.status(200).json({ value: "Hello World" });
});

router.post("/login", async (req: Request, res: Response) => {
  const { body } = req;
  const { username, password } = body;
  const result = await Container.get(AuthService).login(username, password);
  res.status(200).json(result);
});

router.post("/signup", async (req: Request, res: Response) => {
  const { body } = req;
  await Container.get(AuthService).signup(body);
  res.status(200).send("done");
});

export default router;
