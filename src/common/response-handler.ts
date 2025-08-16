import { NextFunction, Request, Response } from "express";
import { ApiError } from "./api-error";
import { errorResponse, successResponse } from "./response.type";

export const responseHandler =
  (
    handler: (req: Request, res: Response, next: NextFunction) => Promise<any>,
    successMessage?: string
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await handler(req, res, next);

      // Skip if the handler already sent a response
      if (!res.headersSent) {
        res.json(
          successResponse(result, successMessage, res.statusCode || 200)
        );
      }
    } catch (err: ApiError | any) {
      // You can customize this further (e.g., custom error classes)
      if (!res.headersSent) {
        res
          .status(err.statusCode || 500)
          .json(
            errorResponse(
              err.message || "Internal Server Error",
              err.errorDetails || null,
              err.statusCode || 500
            )
          );
      }
    }
  };
