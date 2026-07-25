import { z } from 'zod';
export const createCategorySchema = z.object({ name: z.string().min(2).max(50), type: z.enum(['INCOME', 'EXPENSE'], { errorMap: () => ({ message: 'Type must be INCOME or EXPENSE' }) }) });
export type CreateCategorySchemaType = z.infer<typeof createCategorySchema>;
