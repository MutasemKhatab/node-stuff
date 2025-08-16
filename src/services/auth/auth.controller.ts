import { Request, Response } from "express";
import { ApiError } from "../../common/api-error.ts";
import { responseHandler } from "../../common/response-handler.ts";
import { getEmailFromRequest } from "../../utils/token.ts";
import * as authService from "./auth.service.ts";
import {
  ChangePasswordRequest,
  LoginRequest,
  RegisterRequest,
} from "./auth.types.ts";

export const login = responseHandler(async (req: Request, res: Response) => {
  const loginRequest = req.body as LoginRequest;
  const token = await authService.login(loginRequest);
  return token;
}, "Login successful");

export const register = responseHandler(async (req: Request, res: Response) => {
  const registerRequest = req.body as RegisterRequest;
  const result = await authService.register(registerRequest);
  if (result.id === 0) {
    throw new ApiError(
      `User with email ${registerRequest.email} already exists`,
      409
    );
  }
  res.status(201);
  return result;
}, "User registered successfully");

export const changePassword = responseHandler(
  async (req: Request, res: Response) => {
    const email = getEmailFromRequest(req);
    const changePasswordRequest = req.body as ChangePasswordRequest;
    if (
      !changePasswordRequest.oldPassword ||
      !changePasswordRequest.newPassword
    ) {
      throw new ApiError("Old password and new password are required", 400);
    }
    await authService.changePassword(changePasswordRequest, email);
    res.status(204);
    return;
  },
  "Password changed successfully"
);
