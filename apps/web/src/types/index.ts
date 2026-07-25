export interface User { id: string; name: string; email: string; currency: string; }

export interface Category { id: string; name: string; type: 'INCOME' | 'EXPENSE'; isDefault: boolean; }

export interface Transaction { id: string; amount: number; type: 'INCOME' | 'EXPENSE'; description: string | null; date: string; category: { id: string; name: string }; createdAt: string; }

export interface Budget { id: string; amount: number; month: number; year: number; spent: number; remaining: number; isOverspent: boolean; category: { id: string; name: string } | null; }

export interface DashboardData { currentBalance: number; monthlyIncome: number; monthlyExpenses: number; monthlyBudget: number | null; budgetRemaining: number | null; isOverBudget: boolean; recentTransactions: Transaction[]; }
