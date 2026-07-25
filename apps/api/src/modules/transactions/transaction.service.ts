import { prisma } from '../../config/db.js';
import { AppError } from '../../utils/AppError.js';
import type { CreateTransactionInput, UpdateTransactionInput, TransactionResponse, TransactionFilters } from './transaction.types.js';
function formatTransaction(t: { id: string; amount: number; type: string; description: string | null; date: Date; createdAt: Date; category: { id: string; name: string } }): TransactionResponse {
  return { id: t.id, amount: t.amount, type: t.type as 'INCOME' | 'EXPENSE', description: t.description, date: t.date.toISOString().split('T')[0]!, category: t.category, createdAt: t.createdAt.toISOString() };
}
export async function createTransaction(userId: string, input: CreateTransactionInput): Promise<TransactionResponse> {
  const category = await prisma.category.findFirst({ where: { id: input.categoryId, userId } });
  if (!category) throw new AppError('Category not found', 404);
  if (category.type !== input.type) throw new AppError('Category type does not match transaction type', 400);
  const t = await prisma.transaction.create({ data: { amount: input.amount, type: input.type, description: input.description ?? null, date: new Date(input.date), userId, categoryId: input.categoryId }, include: { category: { select: { id: true, name: true } } } });
  return formatTransaction(t);
}
export async function getUserTransactions(userId: string, filters: TransactionFilters): Promise<TransactionResponse[]> {
  const where: Record<string, unknown> = { userId };
  if (filters.type) where['type'] = filters.type;
  if (filters.categoryId) where['categoryId'] = filters.categoryId;
  if (filters.month && filters.year) { const start = new Date(filters.year, filters.month - 1, 1); const end = new Date(filters.year, filters.month, 0, 23, 59, 59); where['date'] = { gte: start, lte: end }; }
  const ts = await prisma.transaction.findMany({ where, include: { category: { select: { id: true, name: true } } }, orderBy: { date: 'desc' } });
  return ts.map(formatTransaction);
}
export async function updateTransaction(userId: string, transactionId: string, input: UpdateTransactionInput): Promise<TransactionResponse> {
  const existing = await prisma.transaction.findFirst({ where: { id: transactionId, userId } });
  if (!existing) throw new AppError('Transaction not found', 404);
  if (input.categoryId) { const cat = await prisma.category.findFirst({ where: { id: input.categoryId, userId } }); if (!cat) throw new AppError('Category not found', 404); }
  const t = await prisma.transaction.update({ where: { id: transactionId }, data: { ...(input.amount !== undefined && { amount: input.amount }), ...(input.description !== undefined && { description: input.description }), ...(input.date !== undefined && { date: new Date(input.date) }), ...(input.categoryId !== undefined && { categoryId: input.categoryId }) }, include: { category: { select: { id: true, name: true } } } });
  return formatTransaction(t);
}
export async function deleteTransaction(userId: string, transactionId: string): Promise<void> {
  const existing = await prisma.transaction.findFirst({ where: { id: transactionId, userId } });
  if (!existing) throw new AppError('Transaction not found', 404);
  await prisma.transaction.delete({ where: { id: transactionId } });
}
