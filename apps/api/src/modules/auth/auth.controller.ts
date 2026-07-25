import type { Request, Response, NextFunction } from 'express';
import { registerSchema, loginSchema } from './auth.schema.js';
import { registerUser, loginUser, forgotPassword, resetPassword } from './auth.service.js';
export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { const data = registerSchema.parse(req.body); const user = await registerUser(data); res.status(201).json({ message: 'Account created successfully', data: user }); } catch (error) { next(error); }
}
export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { const data = loginSchema.parse(req.body); const result = await loginUser(data); res.status(200).json({ message: 'Login successful', data: result }); } catch (error) { next(error); }
}
export async function forgot(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { const { email } = req.body; if (!email) { res.status(400).json({ message: 'Email is required' }); return; } const message = await forgotPassword(email); res.status(200).json({ message }); } catch (error) { next(error); }
}
export async function reset(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { const { token, password } = req.body; if (!token || !password) { res.status(400).json({ message: 'Token and password are required' }); return; } await resetPassword(token, password); res.status(200).json({ message: 'Password reset successfully' }); } catch (error) { next(error); }
}
