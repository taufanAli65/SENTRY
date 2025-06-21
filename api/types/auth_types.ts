import { Request } from 'express';
import { UserRoles } from '../models/users';
export interface RegisterResult {
  id: string;
  email: string;
  password: string;
  name: string;
  photoUrl: string;
  role: string;
}

export interface GeneratedPassword {
  password: string;
  hashedPassword: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRoles;
  },
  token: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface AuthUser {
    id: string;
    email: string;
    role: string;
}

export interface AuthenticatedRequest extends Request {
    user: AuthUser;
}