import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRoles } from "../models/users";
import { AppError } from "../utils/app_error";
import { AuthUser } from "../types/auth_types";

export interface AuthPayload {
  id: string;
  email: string;
  role: UserRoles;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw AppError("Authorization token missing", 401);
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as AuthPayload;

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role as UserRoles,
    };

    next();
  } catch (err) {
    throw AppError("Invalid or expired token", 401);
  }
};