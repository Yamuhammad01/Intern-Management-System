import { UserRole } from '@prisma/client';

// ===== Register =====
export interface RegisterRequestDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface RegisterResponseDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
}

// ===== Login =====
export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
  };
}

// ===== Refresh Token =====
export interface RefreshTokenRequestDTO {
  refreshToken: string;
}

export interface RefreshTokenResponseDTO {
  accessToken: string;
  refreshToken: string;
}

// ===== Logout =====
export interface LogoutRequestDTO {
  refreshToken: string;
}

// ===== Forgot Password =====
export interface ForgotPasswordRequestDTO {
  email: string;
}

// ===== Reset Password =====
export interface ResetPasswordRequestDTO {
  token: string;
  password: string;
}

// ===== Change Password =====
export interface ChangePasswordRequestDTO {
  currentPassword: string;
  newPassword: string;
}