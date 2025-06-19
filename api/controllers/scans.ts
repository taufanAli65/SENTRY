import { Request, Response, NextFunction } from 'express';
import { createScanService, updateScanService } from '../services/scans';
import { addScanSchema, updateScanSchema, scanIdSchema } from '../validator/scans_validator';
import { sendSuccess } from '../utils/send_response';
import { validate } from '../utils/validate';

export const createScan = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { id_user, id_item, isOut } = validate(addScanSchema, req.body);
        const result = await createScanService(id_user, id_item, isOut);
        return sendSuccess(res, 201, "Scan input item successfully", result);
    } catch (error) {
        next(error);
    }
};

export const updateScan = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { id } = validate(scanIdSchema, req.params);
        const result = await updateScanService(id);
        return sendSuccess(res, 200, "Scan out item successfully", result);
    } catch (error) {
        next(error);
    }
};
