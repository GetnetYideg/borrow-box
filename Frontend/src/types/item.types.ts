import type { Category } from '../constants/categories';
import type { ItemStatus } from '../constants/itemStatus';

export interface Item {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  category: Category;
  imageUrl?: string | null;
  identifier?: string | null;
  status: ItemStatus;
  createdAt: string;
  updatedAt: string;
}

/** Body for POST /api/item/ */
export interface CreateItemInput {
  name: string;
  description?: string;
  category?: Category;
  imageUrl?: string;
  identifier?: string;
  status: ItemStatus;
}

/** Body for PUT /api/item/:id — all fields optional */
export interface UpdateItemInput {
  name?: string;
  description?: string;
  category?: Category;
  imageUrl?: string;
  identifier?: string;
  status?: ItemStatus;
}
