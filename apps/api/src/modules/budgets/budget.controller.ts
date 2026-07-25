import type { Request, Response, NextFunction } from 'express';
import { createBudgetSchema, updateBudgetSchema } from './budget.schema.js';
import { createBudget, getUserBudgets, updateBudget, deleteBudget } from './budget.service.js';
import { AppError } from '../../utils/AppError.js';
export async function addBudget(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { if (!req.userId) throw new AppError('Authentication required', 401); const data = createBudgetSchema.parse(req.body); const budget = await createBudget(req.userId, data); res.status(201).json({ message: 'Budget created successfully', data: budget }); } catch (error) { next(error); }
}
export async function getBudgets(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { if (!req.userId) throw new AppError('Authentication required', 401); const now = new Date(); const month = req.query['month'] ? Number(req.query['month']) : now.getMonth() + 1; const year = req.query['year'] ? Number(req.query['year']) : now.getFullYear(); const budgets = await getUserBudgets(req.userId, month, year); res.status(200).json({ data: budgets }); } catch (error) { next(error); }
}
export async function editBudget(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { if (!req.userId) throw new AppError('Authentication required', 401); const data = updateBudgetSchema.parse(req.body); const budget = await updateBudget(req.userId, req.params['id']!, data); res.status(200).json({ message: 'Budget updated successfully', data: budget }); } catch (error) { next(error); }
}
export async function removeBudget(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { if (!req.userId) throw new AppError('Authentication required', 401); await deleteBudget(req.userId, req.params['id']!); res.status(200).json({ message: 'Budget deleted successfully' }); } catch (error) { next(error); }
}
