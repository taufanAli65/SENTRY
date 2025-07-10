import { Request, Response, NextFunction } from 'express';
import { createScanService, getScanHistory } from '../services/scans';
import { addScanSchema, scanIdSchema } from '../validator/scans_validator';
import { sendSuccess } from '../utils/send_response';
import { validate } from '../utils/validate';
import { AuthenticatedRequest } from '../types/auth_types'; // tambahkan import ini

export const createScan = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { code_item, isOut } = validate(addScanSchema, req.body);
        const user_id = req.user.id;
        const result = await createScanService(user_id, code_item, isOut);
        return sendSuccess(res, 201, "Scan input item successfully", result);
    } catch (error) {
        next(error);
    }
};

export const getScans = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const result = await getScanHistory(page, limit);
        return sendSuccess(res, 200, "Scans fetched successfully", result);
    } catch (error) {
        next(error);
    }
};

export const updateScan = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { code_item } = validate(addScanSchema, req.body);
        const user_id = req.user.id;
        const result = await createScanService(user_id, code_item, true); // isOut = true
        return sendSuccess(res, 200, "Scan out item successfully", result);
    } catch (error) {
        next(error);
    }
}