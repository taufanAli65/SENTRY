import { z } from 'zod'
import mongoose from 'mongoose';

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ID, check again",
});

export const addScanSchema = z.object({
    code_item: z.string().regex(/^SNTRY\d{3}$/, "Invalid item code format"),
    isOut: z.boolean().optional(),
});

export const updateScanSchema = z.object({});

export const scanIdSchema = z.object({
    scan_id : objectIdSchema
});
