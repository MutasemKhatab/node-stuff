import bcrypt from "bcrypt";
import { NOTFOUND, UNAUTHORIZED } from "../../constants/http-status-codes.ts";
import {
  create,
  findByEmail,
  updatePassword,
} from "../../db/user.repository.ts";
import { ApiError } from "../../utils/api-error.ts";
import { generateToken } from "../../utils/token.ts";
import {
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "./auth.types.ts";

/**
 * @function login
 * Authenticates a user and generates a JWT token.
 * @param {LoginRequest} loginRequest - The login credentials.
 * @returns {Promise<LoginResponse>} A promise that resolves to the login response containing the token.
 * @throws {ApiError} If the credentials are invalid.
 */
export const login = async ({
  email,
  password,
}: LoginRequest): Promise<LoginResponse> => {
  const user = await findByEmail(email);
  if (!user) throw new ApiError("Invalid credentials", UNAUTHORIZED);
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new ApiError("Invalid credentials", UNAUTHORIZED);
  const token = generateToken(user.email);
  return { token };
};

/**
 * @function register
 * Registers a new user and returns the user ID.
 * @param {RegisterRequest} registerRequest - The registration details.
 * @returns {Promise<RegisterResponse>} A promise that resolves to the registration response containing the user ID.
 * @throws {ApiError} If the user already exists.
 */
export const register = async (
  registerRequest: RegisterRequest
): Promise<RegisterResponse> => {
  registerRequest.password = await bcrypt.hash(registerRequest.password, 10);
  const result = await create(registerRequest);
  return result;
};

export const changePassword = async (
  changePasswordRequest: ChangePasswordRequest,
  email: string
): Promise<void> => {
  const user = await findByEmail(email);
  if (!user) throw new ApiError("User not found", NOTFOUND);

  const isOldPasswordValid = await bcrypt.compare(
    changePasswordRequest.oldPassword,
    user.password
  );
  if (!isOldPasswordValid)
    throw new ApiError("Old password is incorrect", UNAUTHORIZED);

  const hasedNewPassword = await bcrypt.hash(
    changePasswordRequest.newPassword,
    10
  );
  updatePassword(email, hasedNewPassword);
};
