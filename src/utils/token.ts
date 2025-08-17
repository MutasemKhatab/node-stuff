import { Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";
import { BADREQUEST, UNAUTHORIZED } from "../constants/http-status-codes";
import { ApiError } from "./api-error";

const SECRET = env.JWT_SECRET;
const EXPIRATION_TIME = "1h";

export const generateToken = (email: string): string => {
  const token = jwt.sign({ email }, SECRET, {
    expiresIn: EXPIRATION_TIME,
  });
  return token;
};

export const verifyToken = (token: string): boolean => {
  try {
    jwt.verify(token, SECRET);
    return true;
  } catch (error) {
    throw new ApiError("Invalid token", UNAUTHORIZED, error);
  }
};

export const decodeToken = (token: string): string | JwtPayload | null => {
  try {
    return jwt.decode(token) as string | JwtPayload | null;
  } catch (error) {
    throw new ApiError("Failed to decode token", BADREQUEST, error);
  }
};

export const getEmailFromRequest = (req: Request): string => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new ApiError("Authorization header missing", UNAUTHORIZED);
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new ApiError("Authorization token is missing", UNAUTHORIZED);
  }
  const decoded = decodeToken(token);
  if (!decoded || typeof decoded !== "object" || !("email" in decoded)) {
    throw new ApiError("Invalid token payload", UNAUTHORIZED);
  }
  return (decoded as { email: string }).email;
};
