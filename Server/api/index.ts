/* eslint-disable @typescript-eslint/no-explicit-any */
import AppClass from "../src/app.js";
import type { Request, Response } from "express";

let handler: any;

export default async function handlerFn(req: Request, res: Response) {
  console.log("AppClass check:", typeof AppClass, Object.keys(AppClass || {}));
  try {
    if (!handler) {
      // 1. Resolve the Interop Issue
      // If AppClass has a .default property, use that. Otherwise, use AppClass itself.
      const ActualAppClass = (AppClass as any).default || AppClass;

      // 2. Instantiate safely
      const appInstance = new ActualAppClass();

      await appInstance.initialize();
      handler = appInstance.app;
    }

    return handler(req, res);
  } catch (err) {
    console.error("API init/handler error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
