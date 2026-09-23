import api from '../lib/axios';
import type { Borrower, CreateBorrowerInput } from '../types/borrower.types';

/** POST /api/borrower/ */
export const createBorrower = async (data: CreateBorrowerInput): Promise<Borrower> => {
  const res = await api.post<Borrower>('/borrower', data);
  return res.data;
};

/** GET /api/borrower/ */
export const getAllBorrowers = async (): Promise<Borrower[]> => {
  const res = await api.get<Borrower[]>('/borrower');
  return res.data;
};

/** GET /api/borrower/:id */
export const getBorrowerById = async (id: string): Promise<Borrower> => {
  const res = await api.get<Borrower>(`/borrower/${id}`);
  return res.data;
};

/** DELETE /api/borrower/:id */
export const deleteBorrower = async (id: string): Promise<void> => {
  await api.delete(`/borrower/${id}`);
};

// NOTE: No PUT /api/borrower/:id exists in the backend — update is not supported.
