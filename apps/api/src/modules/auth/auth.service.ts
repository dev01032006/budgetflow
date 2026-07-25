import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { prisma } from '../../config/db.js';
import { AppError } from '../../utils/AppError.js';
import { signAccessToken, signRefreshToken } from './token.utils.js';
import { seedDefaultCategories } from '../categories/category.service.js';
import type { RegisterInput, AuthUserResponse, LoginInput, LoginResponse } from './auth.types.js';
const SALT_ROUNDS = 10;
export async function registerUser(input: RegisterInput): Promise<AuthUserResponse> {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new AppError('An account with this email already exists', 409);
  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);
  const user = await prisma.user.create({ data: { name: input.name, email: input.email, password: hashedPassword } });
  await seedDefaultCategories(user.id);
  return { id: user.id, name: user.name, email: user.email, currency: user.currency };
}
export async function loginUser(input: LoginInput): Promise<LoginResponse> {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) throw new AppError('Invalid email or password', 401);
  const isPasswordValid = await bcrypt.compare(input.password, user.password);
  if (!isPasswordValid) throw new AppError('Invalid email or password', 401);
  const accessToken = signAccessToken({ userId: user.id });
  const refreshToken = signRefreshToken({ userId: user.id });
  return { user: { id: user.id, name: user.name, email: user.email, currency: user.currency }, tokens: { accessToken, refreshToken } };
}
export async function forgotPassword(email: string): Promise<string> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return 'If this email exists, a reset link has been sent.';
  const token = crypto.randomBytes(32).toString('hex');
  const expiry = new Date(Date.now() + 1000 * 60 * 60);
  await prisma.user.update({ where: { id: user.id }, data: { resetToken: token, resetTokenExpiry: expiry } });
  console.log('PASSWORD RESET TOKEN (copy this):', token);
  return 'If this email exists, a reset link has been sent.';
}
export async function resetPassword(token: string, newPassword: string): Promise<void> {
  const user = await prisma.user.findFirst({ where: { resetToken: token, resetTokenExpiry: { gt: new Date() } } });
  if (!user) throw new AppError('Invalid or expired reset token', 400);
  const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await prisma.user.update({ where: { id: user.id }, data: { password: hashed, resetToken: null, resetTokenExpiry: null } });
}
