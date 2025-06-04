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
  token: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ForgotPasswordResponse {
  message: string;
}