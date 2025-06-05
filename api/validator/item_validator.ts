import { z } from 'zod'
import mongoose from 'mongoose';

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
});

export const addItemSchema = z.object({
    name: z.string().min(5, "Name must be at least 5 characters"),
    weight: z.number(),
});

export const itemIdSchema = z.object({
    id: objectIdSchema
});

export const updateItemSchema = z.object({
    name: z.string().min(5, "Name must be at least 5 characters"),
    weight: z.number(),
});
