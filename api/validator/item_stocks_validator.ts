import { z } from 'zod'
import mongoose from 'mongoose';

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ID, check again",
});

export const addItemStockSchema = z.object({
    id_item: objectIdSchema,
    weight: z.number(),
    stock: z.number(),
});

export const updateItemStockSchema = z.object({
    id_item: objectIdSchema.optional(),
    weight: z.number().optional(),
    stock: z.number().optional(),
});

export const itemStockIdSchema = z.object({
    id: objectIdSchema
});
