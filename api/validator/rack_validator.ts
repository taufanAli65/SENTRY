import { z } from 'zod'
import mongoose from 'mongoose';

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ID, check again",
});

export const addRackSchema = z.object({
    item_code: z.string().regex(/^SNTRY\d{3}$/, "Invalid item code format"),
    weight: z.number(),
    isOut: z.boolean(),
    time: z.coerce.date(),
});

export const updateRackSchema = z.object({
    item_code: z.string().regex(/^SNTRY\d{3}$/, "Invalid item code format"),
    weight: z.number().optional(),
    isOut: z.boolean().optional(),
    time: z.coerce.date().optional(),
});

export const rackIdSchema = z.object({
    item_code: z.string().regex(/^SNTRY\d{3}$/, "Invalid item code format"),
});

export const createRackServiceSchema = z.object({
    weight: z.number(),
    isOut: z.boolean(),
});
