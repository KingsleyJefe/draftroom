/* eslint-disable @typescript-eslint/no-explicit-any */
import App from "../src/app.js";
import type { Request, Response } from "express";

console.log("App typeof:", typeof App);
console.log("App value:", App);

let handler: (req: Request, res: Response) => any;

async function init() {
  const appInstance = new App();
  await appInstance.initialize();
  return appInstance.app;
}

export default async function handlerFn(req: Request, res: Response) {
  try {
    if (!handler) {
      handler = await init();
    }
    return handler(req, res);
  } catch (err) {
    console.error("API init/handler error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
