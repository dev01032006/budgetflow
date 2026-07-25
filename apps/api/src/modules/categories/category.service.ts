import { prisma } from '../../config/db.js';
import { AppError } from '../../utils/AppError.js';
import type { CategoryResponse, CreateCategoryInput } from './category.types.js';
const DEFAULT_CATEGORIES: CreateCategoryInput[] = [
  { name: 'Salary', type: 'INCOME' }, { name: 'Freelance', type: 'INCOME' }, { name: 'Other Income', type: 'INCOME' },
  { name: 'Food & Dining', type: 'EXPENSE' }, { name: 'Rent', type: 'EXPENSE' }, { name: 'Transport', type: 'EXPENSE' },
  { name: 'Utilities', type: 'EXPENSE' }, { name: 'Healthcare', type: 'EXPENSE' }, { name: 'Shopping', type: 'EXPENSE' },
  { name: 'Entertainment', type: 'EXPENSE' }, { name: 'Other Expense', type: 'EXPENSE' },
];
export async function seedDefaultCategories(userId: string): Promise<void> {
  await prisma.category.createMany({ data: DEFAULT_CATEGORIES.map((c) => ({ ...c, userId, isDefault: true })) });
}
export async function getUserCategories(userId: string): Promise<CategoryResponse[]> {
  const cats = await prisma.category.findMany({ where: { userId }, orderBy: [{ type: 'asc' }, { name: 'asc' }] });
  return cats.map((c) => ({ id: c.id, name: c.name, type: c.type as 'INCOME' | 'EXPENSE', isDefault: c.isDefault }));
}
export async function createCategory(userId: string, input: CreateCategoryInput): Promise<CategoryResponse> {
  const existing = await prisma.category.findFirst({ where: { userId, name: { equals: input.name }, type: input.type } });
  if (existing) throw new AppError('A category with this name already exists', 409);
  const cat = await prisma.category.create({ data: { name: input.name, type: input.type, isDefault: false, userId } });
  return { id: cat.id, name: cat.name, type: cat.type as 'INCOME' | 'EXPENSE', isDefault: cat.isDefault };
}
export async function deleteCategory(userId: string, categoryId: string): Promise<void> {
  const cat = await prisma.category.findFirst({ where: { id: categoryId, userId } });
  if (!cat) throw new AppError('Category not found', 404);
  if (cat.isDefault) throw new AppError('Default categories cannot be deleted', 403);
  await prisma.category.delete({ where: { id: categoryId } });
}
