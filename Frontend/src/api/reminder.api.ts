import api from '../lib/axios';
import type { MessageResponse } from '../types/message.types';

/**
 * GET /api/remind/:id
 * Generates a lender-facing reminder message (e.g. "Hi [Lender], John still has your item…").
 * Returns a meaningful string only when status is DUESOON or OVERDUE.
 */
export const getReminder = async (lendId: string): Promise<MessageResponse> => {
  const res = await api.get<MessageResponse>(`/remind/${lendId}`);
  return res.data;
};
