import { z } from "zod";
import { UserRoles } from "../models/users";

export const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(3),
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
    newPassword: z.string().min(8, "Password must be at least 8 characters")
  })
});

export const changePasswordSchema = z.object({
  old_password: z.string().min(8, "Password must be at least 8 characters"),
  new_password: z.string().min(8, "Password must be at least 8 characters"),
})

export const validateImageSchema = z.object({
  file: z.object({
    originalname: z.string(),
    mimetype: z.enum(['image/jpeg', 'image/jpg', 'image/png']),
    size: z.number().min(1, "File size must be greater than 0"),
  })
});
