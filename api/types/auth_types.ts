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
