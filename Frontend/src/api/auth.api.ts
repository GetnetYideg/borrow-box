import api from '../lib/axios';
import type {
  AuthResponse,
  LoginInput,
  RefreshResponse,
  User,
} from '../types/auth.types';

/** POST /api/auth/register */
export const register = async (data: {
  name: string;
  email: string;
  password: string;
}): Promise<User> => {
  const res = await api.post<User>('/auth/register', data);
  return res.data;
};

/** POST /api/auth/login */
export const login = async (data: LoginInput): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>('/auth/login', data);
  return res.data;
};

/** POST /api/auth/logout  (requires valid accessToken — sent by interceptor) */
export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

/** POST /api/auth/refresh  (cookie sent automatically via withCredentials) */
export const refreshAccessToken = async (): Promise<RefreshResponse> => {
  const res = await api.post<RefreshResponse>('/auth/refresh');
  return res.data;
};
