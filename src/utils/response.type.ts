import { INTERNALSERVERERROR, OK } from "../constants/http-status-codes";

/**
 * @interface ApiResponse<T>
 * Represents a standardized API response structure.
 * @template T - The type of data returned in the response.
 * @property {boolean} success - Indicates if the request was successful.
 * @property {T | null} data - The data returned from the request, or null if there is no data.
 * @property {string} message - A message describing the result of the request.
 * @property {any} [errors] - Optional field for additional error details.
 * @property {number} [statusCode] - The HTTP status code of the response.
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  errors?: any;
  statusCode?: number;
}
/**
 *
 * @param data the returned value from the function
 * @param message the message that responseHandler accepts it as second parameter
 * @param statusCode it explains itself
 * @returns the response object that will be sent to the client
 */
export const successResponse = <T>(
  data: T,
  message = "Success",
  statusCode: number = OK
): ApiResponse<T> => {
  return {
    success: true,
    data,
    message,
    statusCode,
  };
};

/**
 *
 * @param message the error message. usually its the first argument of the ApiError exception
 * @param errors extra error details
 * @param statusCode it explains itself
 * @returns the response object that will be sent to the client
 */
export const errorResponse = (
  message = "Error",
  errors: any = null,
  statusCode: number = INTERNALSERVERERROR
): ApiResponse<null> => {
  return {
    success: false,
    data: null,
    message,
    errors,
    statusCode,
  };
};
