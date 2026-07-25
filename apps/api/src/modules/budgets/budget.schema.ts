import { z } from 'zod';
export const createBudgetSchema = z.object({ amount: z.number({ invalid_type_error: 'Amount must be a number' }).positive(), month: z.number().int().min(1).max(12), year: z.number().int().min(2000).max(2100), categoryId: z.string().uuid().optional() });
export const updateBudgetSchema = z.object({ amount: z.number({ invalid_type_error: 'Amount must be a number' }).positive() });
export type CreateBudgetSchemaType = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetSchemaType = z.infer<typeof updateBudgetSchema>;
