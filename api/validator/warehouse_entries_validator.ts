import { z } from 'zod'
import mongoose from 'mongoose';

export const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ID, check again",
});

export const addWarehouseEntrySchema = z.object({
    id_user: objectIdSchema,
    entry_time: z.coerce.date().optional(),
    face_recognition: z.string().url().or(z.string().min(1)).refine((val) => val.length > 0, {
        message: "Face recognition image URL or path must be a non-empty string",
    }),
});