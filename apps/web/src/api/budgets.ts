import api from './client';

export async function getBudgets(month?: number, year?: number) {
  const res = await api.get('/budgets', { params: { month, year } });
  return res.data.data;
}

export async function createBudget(data: { amount: number; month: number; year: number; categoryId?: string }) {
  const res = await api.post('/budgets', data);
  return res.data.data;
}

export async function deleteBudget(id: string) {
  const res = await api.delete('/budgets/' + id);
  return res.data;
}
