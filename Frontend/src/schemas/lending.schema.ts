import { z } from 'zod';

export const lendItemSchema = z.object({
  itemId: z.string().uuid('Please select an item'),
  borrowerId: z.string().uuid('Please select a borrower'),
  expectedReturnDate: z
    .string()
    .min(1, 'Expected return date is required')
    .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format')
    .refine((val) => new Date(val).getTime() > Date.now() - 86400000, {
      message: 'Expected return date cannot be in the past',
    }),
  notes: z.string().optional(),
});

export type LendItemFormValues = z.infer<typeof lendItemSchema>;
