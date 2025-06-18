import { ZodSchema } from 'zod';
import { AppError } from './app_error';
import { flattenZodError } from './flatten_zod_error';

export function validate<T>(schema: ZodSchema<T>, payload: unknown): T {
  const result = schema.safeParse(payload);
  if (!result.success) {
    const formatted = flattenZodError(result.error.format());
    throw AppError('Validation failed', 400, formatted);
  }
  return result.data;
}
