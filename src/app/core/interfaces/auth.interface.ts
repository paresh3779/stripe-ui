import { User } from './user.interface';

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
  expiresIn: number;
  issuedAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export interface RegisterResponse {
  user: User;
  tokens: AuthTokens;
}

export interface RefreshTokenResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}
