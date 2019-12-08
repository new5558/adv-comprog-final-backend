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
  try {
    const result = await Container.get(AuthService).login(username, password);
    if(result.user) {
      res.status(200).json(result);
    } else {
      res.status(500).send();
    }
  } catch(e) {
    res.status(401).send(e + '');
  }
});

router.post("/signup", async (req: Request, res: Response) => {
  const { body } = req;
  try {
    const result = await Container.get(AuthService).signup(body);
    res.status(200).send(result);
  } catch(e) {
    res.status(401).send(e);
  }
});

export default router;
