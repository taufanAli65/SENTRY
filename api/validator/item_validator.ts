import { z } from "zod";

export const createItemSchema = z.object({
  name: z.string().min(2),
  weight: z.coerce.number().positive(),
  category: z.string().min(2),
});
