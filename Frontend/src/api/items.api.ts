import api from '../lib/axios';
import type { Category } from '../constants/categories';
import type { Item, CreateItemInput, UpdateItemInput } from '../types/item.types';

/** POST /api/item/ */
export const createItem = async (data: CreateItemInput): Promise<Item> => {
  const res = await api.post<Item>('/item', data);
  return res.data;
};

/** GET /api/item/ */
export const getAllItems = async (): Promise<Item[]> => {
  const res = await api.get<Item[]>('/item');
  return res.data;
};

/** GET /api/item/?category=<val>  — same endpoint, query param triggers server-side branch */
export const filterItemsByCategory = async (category: Category): Promise<Item[]> => {
  const res = await api.get<Item[]>('/item', { params: { category } });
  return res.data;
};

/** GET /api/item/:id */
export const getItemById = async (id: string): Promise<Item> => {
  const res = await api.get<Item>(`/item/${id}`);
  return res.data;
};

/** PUT /api/item/:id */
export const updateItem = async (id: string, data: UpdateItemInput): Promise<Item> => {
  const res = await api.put<Item>(`/item/${id}`, data);
  return res.data;
};

/** DELETE /api/item/:id */
export const deleteItem = async (id: string): Promise<void> => {
  await api.delete(`/item/${id}`);
};
