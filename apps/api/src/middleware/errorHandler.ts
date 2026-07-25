import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError.js';
export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (error instanceof ZodError) { res.status(400).json({ message: 'Validation failed', errors: error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })) }); return; }
  if (error instanceof AppError) { res.status(error.statusCode).json({ message: error.message }); return; }
  console.error('Unexpected error:', error);
  res.status(500).json({ message: 'Something went wrong on our end' });
}
