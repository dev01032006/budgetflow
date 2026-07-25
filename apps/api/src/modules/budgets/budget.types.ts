export interface CreateBudgetInput { amount: number; month: number; year: number; categoryId?: string; }
export interface UpdateBudgetInput { amount: number; }
export interface BudgetResponse { id: string; amount: number; month: number; year: number; spent: number; remaining: number; isOverspent: boolean; category: { id: string; name: string } | null; }
