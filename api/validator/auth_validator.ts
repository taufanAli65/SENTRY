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
