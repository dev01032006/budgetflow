import type { Request, Response, NextFunction } from 'express';
import { getDashboardData } from './dashboard.service.js';
import { AppError } from '../../utils/AppError.js';
export async function getDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { if (!req.userId) throw new AppError('Authentication required', 401); const data = await getDashboardData(req.userId); res.status(200).json({ data }); } catch (error) { next(error); }
}
