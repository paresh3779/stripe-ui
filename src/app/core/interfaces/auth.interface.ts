import { User } from './user.interface';

/** Authentication tokens (stored in HTTP-only cookies) */
export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
  expiresIn: number;
  issuedAt: Date;
}

/** Login request payload */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Registration request payload */
export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/** Login response with user and tokens */
export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

/** Registration response with user and tokens */
export interface RegisterResponse {
  user: User;
  tokens: AuthTokens;
}

/** Token refresh response */
export interface RefreshTokenResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

/** Forgot password request */
export interface ForgotPasswordRequest {
  email: string;
}

/** Password reset request with token */
export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}
