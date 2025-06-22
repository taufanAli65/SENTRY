import { z } from "zod";
import { UserRoles } from "../models/users";

export const getUsersQuerySchema = z.object({
  role: z.enum([UserRoles.Admin, UserRoles.Employee]).optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).optional(),
});

export const userIdParamSchema = z.object({
  id: z.string().min(1, "User ID is required"),
});
