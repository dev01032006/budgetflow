import { z } from 'zod';
export const createTransactionSchema = z.object({ amount: z.number({ invalid_type_error: 'Amount must be a number' }).positive(), type: z.enum(['INCOME', 'EXPENSE'], { errorMap: () => ({ message: 'Type must be INCOME or EXPENSE' }) }), description: z.string().max(255).optional(), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'), categoryId: z.string().uuid('Invalid category ID') });
export const updateTransactionSchema = z.object({ amount: z.number().positive().optional(), description: z.string().max(255).optional(), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), categoryId: z.string().uuid().optional() });
export type CreateTransactionSchemaType = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionSchemaType = z.infer<typeof updateTransactionSchema>;
