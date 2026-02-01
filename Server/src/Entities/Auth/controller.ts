import { CreateUserDTO } from "./dto";
import AuthService from "./service.js";
import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../global/constants/http-status-codes.js";

export const signup = async (
  req: Request<object, object, CreateUserDTO>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await AuthService.createUser(req.body);

    // TODO: send confirmation mail

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "signup successful. Check your email to verify your account.",
    });
  } catch (error) {
    next(error);
  }
};
