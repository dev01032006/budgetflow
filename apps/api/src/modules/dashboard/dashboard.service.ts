import { prisma } from '../../config/db.js';
import type { DashboardResponse } from './dashboard.types.js';
export async function getDashboardData(userId: string): Promise<DashboardResponse> {
  const now = new Date(); const month = now.getMonth() + 1; const year = now.getFullYear();
  const monthStart = new Date(year, month - 1, 1); const monthEnd = new Date(year, month, 0, 23, 59, 59);
  const [allTimeIncome, allTimeExpenses, monthlyIncome, monthlyExpenses, monthlyBudget, recentTransactions] = await Promise.all([
    prisma.transaction.aggregate({ where: { userId, type: 'INCOME' }, _sum: { amount: true } }),
    prisma.transaction.aggregate({ where: { userId, type: 'EXPENSE' }, _sum: { amount: true } }),
    prisma.transaction.aggregate({ where: { userId, type: 'INCOME', date: { gte: monthStart, lte: monthEnd } }, _sum: { amount: true } }),
    prisma.transaction.aggregate({ where: { userId, type: 'EXPENSE', date: { gte: monthStart, lte: monthEnd } }, _sum: { amount: true } }),
    prisma.budget.findFirst({ where: { userId, month, year, categoryId: null } }),
    prisma.transaction.findMany({ where: { userId }, orderBy: { date: 'desc' }, take: 5, include: { category: { select: { id: true, name: true } } } }),
  ]);
  const totalIncome = allTimeIncome._sum.amount ?? 0; const totalExpenses = allTimeExpenses._sum.amount ?? 0;
  const thisMonthIncome = monthlyIncome._sum.amount ?? 0; const thisMonthExpenses = monthlyExpenses._sum.amount ?? 0;
  const budgetAmount = monthlyBudget?.amount ?? null;
  const budgetRemaining = budgetAmount !== null ? budgetAmount - thisMonthExpenses : null;
  return { currentBalance: totalIncome - totalExpenses, monthlyIncome: thisMonthIncome, monthlyExpenses: thisMonthExpenses, monthlyBudget: budgetAmount, budgetRemaining, isOverBudget: budgetAmount !== null && thisMonthExpenses > budgetAmount, recentTransactions: recentTransactions.map((t) => ({ id: t.id, amount: t.amount, type: t.type as 'INCOME' | 'EXPENSE', description: t.description, date: t.date.toISOString().split('T')[0]!, category: t.category })) };
}
