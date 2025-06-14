import { Request, Response, NextFunction } from "express";
import Item from "../models/item";
import { getNextItemCode } from "../services/itemservice";
import { createItemSchema } from "../validator/item_validator";
import { validate } from "../utils/validate";
import { sendSuccess } from "../utils/send_response";
import { AppError } from "../utils/app_error";
import { validateImageSchema } from "../validator/auth_validator";

export const createItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { name, weight, category } = validate(createItemSchema, req.body);

    if (!req.file) throw AppError("Item photo is required", 400);

    const item_code = await getNextItemCode();
    const image = req.file as Express.Multer.File;
    validate(validateImageSchema, { file: image });
    const photo_url = `/uploads/${req.file.filename}`;

    const item = await Item.create({
      item_code,
      name,
      weight,
      category,
      photo_url,
    });

    return sendSuccess(res, 201, "Item successfully created", item);
  } catch (err) {
    next(err);
  }
};
