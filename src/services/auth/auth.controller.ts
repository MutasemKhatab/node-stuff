import { Request, Response } from "express";
import { ApiError } from "../../common/api-error.ts";
import { responseHandler } from "../../common/response-handler.ts";
import * as authService from "./auth.service.ts";
import { LoginRequest, RegisterRequest } from "./auth.types.ts";

export const login = responseHandler(async (req: Request, res: Response) => {
  const loginRequest = req.body as LoginRequest;
  const token = await authService.login(loginRequest);
  return token; // Return data instead of manually sending response
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
  res.status(201); // Set 201 status for successful creation
  return result; // Return data instead of manually sending response
}, "User registered successfully");
