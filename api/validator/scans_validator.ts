import { z } from 'zod'
import mongoose from 'mongoose';

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ID, check again",
});

export const addScanSchema = z.object({
    id_user: objectIdSchema,
    id_item: objectIdSchema,
    isOut: z.boolean().optional(),
});

export const updateScanSchema = z.object({});

export const scanIdSchema = z.object({
    id: objectIdSchema
});
