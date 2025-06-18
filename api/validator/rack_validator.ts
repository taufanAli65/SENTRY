import { z } from 'zod'
import mongoose from 'mongoose';

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ID, check again",
});

export const addRackSchema = z.object({
    id_item: objectIdSchema,
    weight: z.number(),
    isOut: z.boolean(),
    time: z.coerce.date(),
});

export const updateRackSchema = z.object({
    id_item: objectIdSchema.optional(),
    weight: z.number().optional(),
    isOut: z.boolean().optional(),
    time: z.coerce.date().optional(),
});

export const rackIdSchema = z.object({
    id: objectIdSchema
});

export const createRackServiceSchema = z.object({
    id_item: objectIdSchema,
    isOut: z.boolean(),
});
