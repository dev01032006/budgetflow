export type TransactionType = 'INCOME' | 'EXPENSE';
export interface CategoryResponse { id: string; name: string; type: TransactionType; isDefault: boolean; }
export interface CreateCategoryInput { name: string; type: TransactionType; }
