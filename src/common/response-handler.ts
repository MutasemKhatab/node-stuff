import { NextFunction, Request, Response } from "express";
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

      if (res.headersSent) return; // If headers are already sent, do not send another response
      res.json(successResponse(result, successMessage, res.statusCode || 200));
    } catch (err: ApiError | any) {
      if (res.headersSent) return; // If headers are already sent, do not send another response{
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
  };
