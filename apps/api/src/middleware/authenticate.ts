import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../modules/auth/token.utils.js';
import { AppError } from '../utils/AppError.js';
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) throw new AppError('Authentication required', 401);
    const token = authHeader.split(' ')[1];
    if (!token) throw new AppError('Authentication required', 401);
    const payload = verifyAccessToken(token);
    req.userId = payload.userId;
    next();
  } catch (error) { next(error); }
}
