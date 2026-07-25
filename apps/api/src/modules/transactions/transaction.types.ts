export type TransactionType = 'INCOME' | 'EXPENSE';
export interface CreateTransactionInput { amount: number; type: TransactionType; description?: string; date: string; categoryId: string; }
export interface UpdateTransactionInput { amount?: number; description?: string; date?: string; categoryId?: string; }
export interface TransactionResponse { id: string; amount: number; type: TransactionType; description: string | null; date: string; category: { id: string; name: string }; createdAt: string; }
export interface TransactionFilters { month?: number; year?: number; categoryId?: string; type?: TransactionType; }
