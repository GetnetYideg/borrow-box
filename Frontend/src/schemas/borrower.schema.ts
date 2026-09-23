import { z } from 'zod';

// Phone: Ethiopian format — +251 or 0, then [9|7], then 8 digits
const ethiopianPhoneRegex = /^(\+251|0)[97]\d{8}$/;

// Email: Gmail only
const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

export const createBorrowerSchema = z
  .object({
    name: z.string().trim().min(3, 'Name must be at least 3 characters'),
    phone: z
      .string()
      .trim()
      .regex(ethiopianPhoneRegex, 'Enter a valid Ethiopian phone number (+251 9XXXXXXXX or 09XXXXXXXX)')
      .optional()
      .or(z.literal('')),
    email: z
      .string()
      .trim()
      .regex(gmailRegex, 'Only Gmail addresses (@gmail.com) are accepted')
      .optional()
      .or(z.literal('')),
    notes: z.string().optional(),
  })
  .refine((data) => data.phone || data.email, {
    message: 'At least one contact method (phone or email) is required',
    path: ['phone'],
  });

export type CreateBorrowerFormValues = z.infer<typeof createBorrowerSchema>;
