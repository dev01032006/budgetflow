import api from './client';

export async function getTransactions(params?: { month?: number; year?: number; type?: string }) {
  const res = await api.get('/transactions', { params });
  return res.data.data;
}

export async function createTransaction(data: { amount: number; type: string; description?: string; date: string; categoryId: string }) {
  const res = await api.post('/transactions', data);
  return res.data.data;
}

export async function updateTransaction(id: string, data: { amount?: number; description?: string; date?: string; categoryId?: string }) {
  const res = await api.put('/transactions/' + id, data);
  return res.data.data;
}

export async function deleteTransaction(id: string) {
  const res = await api.delete('/transactions/' + id);
  return res.data;
}
