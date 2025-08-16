import bcrypt from "bcrypt";
import { create, findByEmail } from "../../db/user.repository.ts";
import { gererateToken } from "../../utils/token.ts";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "./auth.types.ts";

export const login = async ({
  email,
  password,
}: LoginRequest): Promise<LoginResponse> => {
  const user = await findByEmail(email);
  if (!user) throw Error("Invalid credentials");
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw Error("Invalid credentials");
  const token = gererateToken(user.email);
  return { token };
};

export const register = async (
  registerRequest: RegisterRequest
): Promise<RegisterResponse> => {
  registerRequest.password = await bcrypt.hash(registerRequest.password, 10);
  const result = await create(registerRequest);
  return result;
};
