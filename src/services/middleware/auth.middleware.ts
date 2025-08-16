import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { ApiError } from "../../common/api-error";

export const validate = (schema: ZodType<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      throw new ApiError("Validation error", 400, result.error);
    }
    req.body = result.data;
    next();
  };
};
