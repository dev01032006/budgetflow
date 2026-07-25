import type { Request, Response, NextFunction } from 'express';
import { createCategorySchema } from './category.schema.js';
import { getUserCategories, createCategory, deleteCategory } from './category.service.js';
import { AppError } from '../../utils/AppError.js';
export async function getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { if (!req.userId) throw new AppError('Authentication required', 401); const categories = await getUserCategories(req.userId); res.status(200).json({ data: categories }); } catch (error) { next(error); }
}
export async function addCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { if (!req.userId) throw new AppError('Authentication required', 401); const data = createCategorySchema.parse(req.body); const category = await createCategory(req.userId, data); res.status(201).json({ message: 'Category created successfully', data: category }); } catch (error) { next(error); }
}
export async function removeCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { if (!req.userId) throw new AppError('Authentication required', 401); await deleteCategory(req.userId, req.params['id']!); res.status(200).json({ message: 'Category deleted successfully' }); } catch (error) { next(error); }
}
