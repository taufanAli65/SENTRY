import { UserRoles } from "../models/users";
import { AppError } from "./app_error";

export function validateNewUserRole(role: string) {
  if (!Object.values(UserRoles).includes(role as UserRoles)) {
    throw AppError("Invalid role", 400);
  }
  if (role === UserRoles.Owner) {
    throw AppError("You are not allowed to create an Owner account", 403);
  }
}
