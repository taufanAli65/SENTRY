import { Request, Response, NextFunction } from 'express';
import { addItemService, getItemsService, getItemService } from '../services/items';
import { AppError } from '../utils/app_error';

export const addItem = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { name, weight } = req.body;
        if (!name || !weight) {
            throw AppError("Name and weight are required", 400);
        }
        const result = await addItemService(name, weight);
        res.status(200).json({
            id: result.id,
            name: result.name,
            weight: result.weight,
        });
    } catch (error) {
        next(error);
    }
}

export const getItems = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const result = await getItemsService();
        if(result.length <= 0) {
            throw AppError("No item found", 400)
        }
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export const getItem = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const id = req.params.id;
        if(!id) {
            throw AppError("Parameter ID is required", 400);
        }
        const result = await getItemService(id);
        res.status(200).json({id: result.id, name: result.name, weight: result.weight});
    } catch (error) {
        next(error)
    }
}