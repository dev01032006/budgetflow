import type { Request, Response, NextFunction } from 'express';
import { createTransactionSchema, updateTransactionSchema } from './transaction.schema.js';
import { createTransaction, getUserTransactions, updateTransaction, deleteTransaction } from './transaction.service.js';
import { AppError } from '../../utils/AppError.js';
import type { TransactionFilters } from './transaction.types.js';
export async function addTransaction(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { if (!req.userId) throw new AppError('Authentication required', 401); const data = createTransactionSchema.parse(req.body); const t = await createTransaction(req.userId, data); res.status(201).json({ message: 'Transaction added successfully', data: t }); } catch (error) { next(error); }
}
export async function getTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { if (!req.userId) throw new AppError('Authentication required', 401); const filters: TransactionFilters = { month: req.query['month'] ? Number(req.query['month']) : undefined, year: req.query['year'] ? Number(req.query['year']) : undefined, categoryId: req.query['categoryId'] as string | undefined, type: req.query['type'] as 'INCOME' | 'EXPENSE' | undefined }; const ts = await getUserTransactions(req.userId, filters); res.status(200).json({ data: ts }); } catch (error) { next(error); }
}
export async function editTransaction(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { if (!req.userId) throw new AppError('Authentication required', 401); const data = updateTransactionSchema.parse(req.body); const t = await updateTransaction(req.userId, req.params['id']!, data); res.status(200).json({ message: 'Transaction updated successfully', data: t }); } catch (error) { next(error); }
}
export async function removeTransaction(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { if (!req.userId) throw new AppError('Authentication required', 401); await deleteTransaction(req.userId, req.params['id']!); res.status(200).json({ message: 'Transaction deleted successfully' }); } catch (error) { next(error); }
}
