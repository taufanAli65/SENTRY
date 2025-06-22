import { Request, Response, NextFunction } from "express";
import {
    getUsersQuerySchema,
    userIdParamSchema,
} from "../validator/user_validator";
import { validate } from "../utils/validate";
import { sendSuccess } from "../utils/send_response";
import { getUsers, suspendUserById, unsuspendUserById } from "../services/userservice";

export const listUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      page = 1,
      limit = 10,
      role,
      search,
    } = validate(getUsersQuerySchema, req.query);
    const result = await getUsers(page, limit, role, search);
    return sendSuccess(res, 200, "Users fetched successfully", result);
  } catch (err) {
    next(err);
  }
};

export const suspendUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = validate(userIdParamSchema, req.params);
    const user = await suspendUserById(id);
    return sendSuccess(res, 200, "User suspended and notified", user);
  } catch (err) {
    next(err);
  }
};

export const unsuspendUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = validate(userIdParamSchema, req.params);
    const user = await unsuspendUserById(id);
    return sendSuccess(res, 200, "User unsuspended and notified", user);
  } catch (err) {
    next(err);
  }
};
