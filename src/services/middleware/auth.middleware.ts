import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { ApiError } from "../../common/api-error";
import { decodeToken } from "../../utils/token";

export const validateSchema = (schema: ZodType<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      throw new ApiError("Validation error", 400, result.error);
    }
    req.body = result.data;
    next();
  };
};

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new ApiError("Authorization token is missing", 401);
  }

  try {
    decodeToken(token);
    next();
  } catch (err) {
    throw new ApiError("Invalid or expired token", 401, err);
  }
};
