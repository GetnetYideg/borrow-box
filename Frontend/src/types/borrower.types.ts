export interface Borrower {
  id: string;
  userId: string;
  name: string;
  phone?: string | null; // Ethiopian format: +251 9XXXXXXXX or 09XXXXXXXX
  email?: string | null; // @gmail.com only
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Body for POST /api/borrower/ — requires name + (phone OR email) */
export interface CreateBorrowerInput {
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
}
