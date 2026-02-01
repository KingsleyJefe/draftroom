import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export interface AuthTokenPayload extends JwtPayload {
  id: string;
}

export const generateAccessToken = (payload: { id: string }) => {
  return jwt.sign(payload, String(process.env.ACCESS_TOKEN_SECRET), {
    expiresIn: "1d",
  });
};

export const generateRefreshToken = (payload: { id: string }) => {
  return jwt.sign(payload, String(process.env.REFRESH_TOKEN_SECRET), {
    expiresIn: "7d",
  });
};

export const verifyAccessToken = (token: string): AuthTokenPayload => {
  return jwt.verify(
    token,
    String(process.env.ACCESS_TOKEN_SECRET)
  ) as AuthTokenPayload;
};

export const verifyRefreshToken = (token: string): AuthTokenPayload => {
  return jwt.verify(
    token,
    String(process.env.REFRESH_TOKEN_SECRET)
  ) as AuthTokenPayload;
};
