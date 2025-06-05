import { z } from "zod";
import { UserRoles } from "../models/users";

export const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(3),
  photoUrl: z.string().url(),
  role: z.enum([UserRoles.Admin, UserRoles.Employee]),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  params: z.object({
    token: z.string().min(1, "Reset token is required")
  }),
  body: z.object({
    newPassword: z.string().min(3, "Password must be at least 3 characters")
  })
});

export const changePasswordSchema = z.object({
  old_password: z.string().min(3, "Password must be at least 3 characters"),
  new_password: z.string().min(3, "Password must be at least 3 characters"),
})
