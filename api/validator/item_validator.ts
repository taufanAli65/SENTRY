import { z } from "zod";

export const createItemSchema = z.object({
  name: z.string().min(2),
  weight: z.coerce.number().positive(),
  category: z.string().min(2),
});

export const getItemsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
});

export const itemIdParamSchema = z.object({
  id: z.string().length(24, "Invalid item id"),
});
