import { z } from 'zod';
import { CATEGORIES } from '../constants/categories';
import { ITEM_STATUSES } from '../constants/itemStatus';

export const createItemSchema = z.object({
  name: z.string().trim().min(3, 'Name must be at least 3 characters').max(255),
  description: z.string().optional(),
  category: z.enum(CATEGORIES),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  identifier: z.string().optional(),
  status: z.enum(ITEM_STATUSES),
});

export const updateItemSchema = z.object({
  name: z.string().trim().min(3).max(255).optional(),
  description: z.string().optional(),
  category: z.enum(CATEGORIES).optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  identifier: z.string().optional(),
  status: z.enum(ITEM_STATUSES).optional(),
});

export type CreateItemFormValues = z.infer<typeof createItemSchema>;
export type UpdateItemFormValues = z.infer<typeof updateItemSchema>;
