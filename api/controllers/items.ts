import { Request, Response, NextFunction } from 'express';
import { addItemService, getItemsService, getItemService } from '../services/items';
import { addItemSchema, getItemByIdSchema } from '../validator/item_validator';
import { sendSuccess } from '../utils/send_response';
import { validate } from '../utils/validate';

export const addItem = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { name, weight } = validate(addItemSchema, req.body);
        const result = await addItemService(name, weight);
        return sendSuccess(res, 200, "Add item success", result);
    } catch (error) {
        next(error);
    }
}

export const getItems = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
        const result = await getItemsService(page, limit);
        return sendSuccess(res, 200, "Get Item Success", result);
    } catch (error) {
        next(error);
    }
}

export const getItem = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { id } = validate(getItemByIdSchema, req.params);
        const result = await getItemService(id);
        return sendSuccess(res, 200, `Get item with id:${id} sucess`, result);
    } catch (error) {
        next(error)
    }
}