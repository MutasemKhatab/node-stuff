import { Request, Response } from "express";
import * as authService from "./auth.service.ts";
import { LoginRequest, RegisterRequest } from "./auth.types.ts";

export const login = async (req: Request, res: Response) => {
  const LoginRequest = req.body as LoginRequest;
  const token = await authService.login(LoginRequest);
  res.json(token);
};

export const register = async (req: Request, res: Response) => {
  const registerRequest = req.body as RegisterRequest;
  const result = await authService.register(registerRequest);
  res.json(result);
};
