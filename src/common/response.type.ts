export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  errors?: any;
  statusCode?: number;
}

export const successResponse = <T>(
  data: T,
  message = "Success",
  statusCode: number = 200
): ApiResponse<T> => {
  return {
    success: true,
    data,
    message,
    statusCode,
  };
};

export const errorResponse = (
  message = "Error",
  errors: any = null,
  statusCode: number = 500
): ApiResponse<null> => {
  return {
    success: false,
    data: null,
    message,
    errors,
    statusCode,
  };
};
