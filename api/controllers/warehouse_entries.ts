import { Request, Response, NextFunction } from 'express';
import {
    addWarehouseEntryService,
    getWarehouseEntriesService,
    getWarehouseEntryService
} from '../services/warehouse_entries';
import { addWarehouseEntrySchema, objectIdSchema } from '../validator/warehouse_entries_validator';
import { validate } from '../utils/validate';
import { sendSuccess } from '../utils/send_response';

export async function addWarehouseEntryController(req: Request, res: Response, next: NextFunction) {
    try {
        const parsed = validate(addWarehouseEntrySchema, req.body);
        const result = await addWarehouseEntryService(parsed);
        return sendSuccess(res, 201, "Warehouse entry created successfully.", result);
    } catch (err) {
        next(err);
    }
}

export async function getWarehouseEntriesController(req: Request, res: Response, next: NextFunction) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const result = await getWarehouseEntriesService(page, limit);
        return sendSuccess(res, 200, "Warehouse entries fetched successfully.", result);
    } catch (err) {
        next(err);
    }
}

export async function getWarehouseEntryController(req: Request, res: Response, next: NextFunction) {
    try {
        const id = validate(objectIdSchema, req.params.id);
        const result = await getWarehouseEntryService(id);
        return sendSuccess(res, 200, "Warehouse entry fetched successfully.", result);
    } catch (err) {
        next(err);
    }
}
