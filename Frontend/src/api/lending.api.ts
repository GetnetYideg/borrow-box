import api from '../lib/axios';
import type { LendingRecord, LendItemInput } from '../types/lending.types';

/** GET /api/lend/ — full lending history (no joins; only UUID refs) */
export const getLendingHistory = async (): Promise<LendingRecord[]> => {
  const res = await api.get<LendingRecord[]>('/lend');
  return res.data;
};

/** POST /api/lend/ — creates a lending record; marks item UNAVAILABLE */
export const lendItem = async (data: LendItemInput): Promise<LendingRecord> => {
  const res = await api.post<LendingRecord>('/lend', data);
  return res.data;
};

/** PUT /api/lend/return/:id — marks record RETURNED; restores item status */
export const returnItem = async (id: string): Promise<LendingRecord> => {
  const res = await api.put<LendingRecord>(`/lend/return/${id}`);
  return res.data;
};

/**
 * PUT /api/lend/track/:id
 * Evaluates the due date server-side and updates status to OVERDUE or DUESOON.
 * Call this when opening a lending detail page to get an up-to-date status.
 */
export const trackDueDate = async (
  id: string
): Promise<LendingRecord | { message: string }> => {
  const res = await api.put<LendingRecord | { message: string }>(`/lend/track/${id}`);
  return res.data;
};
