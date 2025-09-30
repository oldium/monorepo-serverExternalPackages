import express from "express";
import { getInfo, increaseInfo, resetInfo } from "@my-project/common/db";

export default function router() {
  const router = express.Router({ strict: true });

  // AJAX requests
  router.post("/api/increase", async (req: express.Request, res: express.Response) => {
    await increaseInfo();
    res.json(await getInfo());
  });
  router.get("/api/info", async (req: express.Request, res: express.Response) => {
    res.json(await getInfo());
  });
  router.post("/api/reset", async (req: express.Request, res: express.Response) => {
    await resetInfo();
    res.json(await getInfo());
  });

  return router;
}
