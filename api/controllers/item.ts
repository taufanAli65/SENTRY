import { Request, Response, NextFunction } from "express";
import Item from "../models/item";
import { getNextItemCode } from "../services/itemservice";
import {
  createItemSchema,
  getItemsQuerySchema,
  itemIdParamSchema,
} from "../validator/item_validator";
import { validate } from "../utils/validate";
import { sendSuccess } from "../utils/send_response";
import { AppError } from "../utils/app_error";
import { validateImageSchema } from "../validator/auth_validator";
import {
  getAllItems,
  getItemById,
  deleteItemById,
} from "../services/itemservice";

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

export const getItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit, search } = validate(getItemsQuerySchema, req.query);
    const safePage = page ?? 1;
    const safeLimit = limit ?? 10;
    const result = await getAllItems(safePage, safeLimit, search);
    return sendSuccess(res, 200, "Items fetched successfully", result);
  } catch (err) {
    next(err);
  }
};

export const getItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = validate(itemIdParamSchema, req.params);
    const item = await getItemById(id);
    if (!item) throw AppError("Item not found", 404);
    return sendSuccess(res, 200, "Item fetched successfully", item);
  } catch (err) {
    next(err);
  }
};

export const deleteItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = validate(itemIdParamSchema, req.params);
    const item = await deleteItemById(id);
    if (!item) throw AppError("Item not found", 404);
    return sendSuccess(res, 200, "Item deleted successfully", item);
  } catch (err) {
    next(err);
  }
};
