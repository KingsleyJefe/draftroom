import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants/http-status-codes.js";

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: "Route not found",
    code: "NOT_FOUND",
  });
};
