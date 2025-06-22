import { Request, Response, NextFunction } from 'express';
import { createRackService } from '../services/racks';
import { createRackServiceSchema } from '../validator/rack_validator';
import { sendSuccess } from '../utils/send_response';
import { validate } from '../utils/validate';

export async function createRack(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        const parsed = validate(createRackServiceSchema, req.body);
        const result = await createRackService(parsed.id_item, parsed.isOut);
        const message = parsed.isOut
            ? "Item successfully removed from the warehouse."
            : "Item successfully added to the warehouse.";
        return sendSuccess(res, 201, message, result);
    } catch (err) {
        next(err);
    }
}
