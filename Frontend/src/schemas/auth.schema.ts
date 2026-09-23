import { z } from 'zod';

// Mirrors backend auth.validation.ts: /^[a-zA-Z0-9._%+-]+@company\.com$/
const corporateEmailRegex = /^[a-zA-Z0-9._%+-]+@company\.com$/;

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required').max(255),
    email: z
      .string()
      .toLowerCase()
      .regex(corporateEmailRegex, 'Email must be a valid @company.com address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(50, 'Password cannot exceed 50 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z
    .string()
    .toLowerCase()
    .regex(corporateEmailRegex, 'Email must be a valid @company.com address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password cannot exceed 50 characters'),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
