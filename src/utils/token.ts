import jwt, { JwtPayload } from "jsonwebtoken";
import { ApiError } from "../common/api-error";
import { env } from "../config/env";

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
    throw new ApiError("Invalid token", 401, error);
  }
};

export const decodeToken = (token: string): string | JwtPayload | null => {
  try {
    return jwt.decode(token) as string | JwtPayload | null;
  } catch (error) {
    console.error("Token decoding failed:", error);
    return null;
  }
};
