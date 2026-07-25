import api from './client';

export interface RegisterData { name: string; email: string; password: string; }
export interface LoginData { email: string; password: string; }

export async function register(data: RegisterData) {
  const res = await api.post('/auth/register', data);
  return res.data;
}

export async function login(data: LoginData) {
  const res = await api.post('/auth/login', data);
  return res.data;
}
