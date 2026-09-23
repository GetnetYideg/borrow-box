import type { LendingStatus } from '../constants/lendingStatus';

export interface LendingRecord {
  id: string;
  userId: string;
  itemId: string;      // UUID — no join; resolve name client-side
  borrowerId: string;  // UUID — no join; resolve name client-side
  lentAt: string;
  expectedReturnDate: string;
  returnedAt?: string | null;
  notes?: string | null;
  status: LendingStatus;
  createdAt: string;
  updatedAt: string;
}

/** Body for POST /api/lend/ */
export interface LendItemInput {
  itemId: string;
  borrowerId: string;
  expectedReturnDate: string; // ISO date string
  notes?: string;
  status?: LendingStatus; // defaults to ACTIVE server-side
}
