import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { AppError } from "../utils/app_error";

export function multerErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (
    err instanceof multer.MulterError ||
    err.message?.includes("Invalid file type")
  ) {
    return next(AppError(err.message, 400));
  }
  next(err);
}
