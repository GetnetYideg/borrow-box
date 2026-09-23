import api from '../lib/axios';
import type { MessageResponse } from '../types/message.types';

/**
 * GET /api/message/:id
 * Generates a borrower-facing reminder message (e.g. "Hi John, the item is overdue…").
 * Returns a meaningful string only when status is DUESOON or OVERDUE.
 */
export const generateMessage = async (lendId: string): Promise<MessageResponse> => {
  const res = await api.get<MessageResponse>(`/message/${lendId}`);
  return res.data;
};
