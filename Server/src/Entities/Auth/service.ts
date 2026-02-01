import bcrypt from "bcrypt";
import crypto from "crypto";
import { Request } from "express";

import UserModel, { IUser } from "../../db/models/user.model.js";
import { CreateUserDTO } from "./dto.js";
import { AuthTokenPayload, verifyAccessToken } from "../../global/library/gen-token.js";

const AuthService = {
  createUser: async function (userData: CreateUserDTO): Promise<IUser> {
    const emailToken = crypto.randomBytes(64).toString("hex");
    const hashedPassword = bcrypt.hashSync(userData.password, 5);

    const user = await UserModel.create({
      ...userData,
      password: hashedPassword,
      emailToken,
    });
    return user;
  },

  verifyAccessToken: function (token: string): AuthTokenPayload {
    return verifyAccessToken(token);
  },

  getAuthorizationHeaderToken: function (req: Request): string | null {
    const { authorization: cookie } = req.headers;
    if (!cookie || !cookie.startsWith("Bearer ")) {
      return null;
    }
    const token = cookie.split(" ")[1];
    return token || null;
  },
};

export default AuthService;
