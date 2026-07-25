import { prisma } from '../../config/db.js';
import { AppError } from '../../utils/AppError.js';
import type { CreateBudgetInput, UpdateBudgetInput, BudgetResponse } from './budget.types.js';
async function calculateSpent(userId: string, month: number, year: number, categoryId?: string | null): Promise<number> {
  const start = new Date(year, month - 1, 1); const end = new Date(year, month, 0, 23, 59, 59);
  const result = await prisma.transaction.aggregate({ where: { userId, type: 'EXPENSE', date: { gte: start, lte: end }, ...(categoryId ? { categoryId } : {}) }, _sum: { amount: true } });
  return result._sum.amount ?? 0;
}
function formatBudget(budget: { id: string; amount: number; month: number; year: number; category: { id: string; name: string } | null }, spent: number): BudgetResponse {
  return { id: budget.id, amount: budget.amount, month: budget.month, year: budget.year, spent, remaining: budget.amount - spent, isOverspent: spent > budget.amount, category: budget.category };
}
export async function createBudget(userId: string, input: CreateBudgetInput): Promise<BudgetResponse> {
  if (input.categoryId) { const cat = await prisma.category.findFirst({ where: { id: input.categoryId, userId } }); if (!cat) throw new AppError('Category not found', 404); if (cat.type !== 'EXPENSE') throw new AppError('Budgets can only be set for expense categories', 400); }
  const existing = await prisma.budget.findFirst({ where: { userId, month: input.month, year: input.year, categoryId: input.categoryId ?? null } });
  if (existing) throw new AppError('A budget for this month already exists. Update it instead.', 409);
  const budget = await prisma.budget.create({ data: { amount: input.amount, month: input.month, year: input.year, userId, categoryId: input.categoryId ?? null }, include: { category: { select: { id: true, name: true } } } });
  const spent = await calculateSpent(userId, budget.month, budget.year, budget.categoryId);
  return formatBudget(budget, spent);
}
export async function getUserBudgets(userId: string, month: number, year: number): Promise<BudgetResponse[]> {
  const budgets = await prisma.budget.findMany({ where: { userId, month, year }, include: { category: { select: { id: true, name: true } } }, orderBy: { createdAt: 'asc' } });
  return Promise.all(budgets.map(async (b) => { const spent = await calculateSpent(userId, b.month, b.year, b.categoryId); return formatBudget(b, spent); }));
}
export async function updateBudget(userId: string, budgetId: string, input: UpdateBudgetInput): Promise<BudgetResponse> {
  const existing = await prisma.budget.findFirst({ where: { id: budgetId, userId } });
  if (!existing) throw new AppError('Budget not found', 404);
  const budget = await prisma.budget.update({ where: { id: budgetId }, data: { amount: input.amount }, include: { category: { select: { id: true, name: true } } } });
  const spent = await calculateSpent(userId, budget.month, budget.year, budget.categoryId);
  return formatBudget(budget, spent);
}
export async function deleteBudget(userId: string, budgetId: string): Promise<void> {
  const existing = await prisma.budget.findFirst({ where: { id: budgetId, userId } });
  if (!existing) throw new AppError('Budget not found', 404);
  await prisma.budget.delete({ where: { id: budgetId } });
}
