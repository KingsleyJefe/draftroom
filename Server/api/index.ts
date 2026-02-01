/* eslint-disable @typescript-eslint/no-explicit-any */
import App from "../src/app.js";
import type { Request, Response } from "express";

// Keep the instance outside the handler for execution reuse
let cachedApp: any;

async function getApp() {
  if (!cachedApp) {
    const appInstance = new App();
    await appInstance.initialize();
    cachedApp = appInstance.app;
  }
  return cachedApp;
}

export default async function handlerFn(req: Request, res: Response) {
  try {
    const app = await getApp();
    // Vercel's Node.js runtime can handle the Express app instance directly
    return app(req, res);
  } catch (err) {
    console.error("API init/handler error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}