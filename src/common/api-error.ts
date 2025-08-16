/**
 * user defined error to throw it from any function in the endpoint
 * and catch it in the @function [responseHandler]
 */
export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public errorDetails?: any
  ) {
    super(message);
    this.name = "ApiError";
    this.errorDetails = errorDetails;
    Error.captureStackTrace(this, this.constructor);
  }
}
