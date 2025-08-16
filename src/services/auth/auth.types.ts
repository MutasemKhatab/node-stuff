export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RegisterModel {
  email: string;
  password: string;
}

export interface UserModel {
  id: number;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterResponse {
  id: number;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}
