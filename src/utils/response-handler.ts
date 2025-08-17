import { NextFunction, Request, Response } from "express";
import { INTERNALSERVERERROR, OK } from "../constants/http-status-codes";
import { ApiError } from "./api-error";
import { errorResponse, successResponse } from "./response.type";
/**
 * unified response scheme that will be sent to the client
 * @param handler the function in the controller that will be executed
 * @param successMessage the message that will be sent in the response if the handler is successful
 * @returns
 */
export const responseHandler =
  (
    handler: (req: Request, res: Response, next: NextFunction) => Promise<any>,
    successMessage?: string
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await handler(req, res, next);

      if (res.headersSent) return;
      res.json(successResponse(result, successMessage, res.statusCode || OK));
    } catch (err: ApiError | any) {
      if (res.headersSent) return;
      res
        .status(err.statusCode || INTERNALSERVERERROR)
        .json(
          errorResponse(
            err.message || "Internal Server Error",
            err.errorDetails || null,
            err.statusCode || INTERNALSERVERERROR
          )
        );
    }
  };
