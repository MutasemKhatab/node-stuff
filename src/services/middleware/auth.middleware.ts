import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { BADREQUEST, UNAUTHORIZED } from "../../constants/http-status-codes";
import { ApiError } from "../../utils/api-error";
import { errorResponse } from "../../utils/response.type";
import { decodeToken } from "../../utils/token";

export const validateSchema = (schema: ZodType<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(BADREQUEST);
      res.json(
        errorResponse("Validation error", result.error.issues, BADREQUEST)
      );
      return;
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
    throw new ApiError("Authorization token is missing", UNAUTHORIZED);
  }

  try {
    decodeToken(token);
    next();
  } catch (err) {
    throw new ApiError("Invalid or expired token", UNAUTHORIZED, err);
  }
};
