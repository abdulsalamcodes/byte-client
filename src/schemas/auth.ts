import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().trim().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export const signUpSchema = z.object({
  display_name: z
    .string()
    .trim()
    .min(1, 'Display name is required')
    .max(50, 'Display name is too long'),
  email: z.string().trim().email('Enter a valid email'),
  password: z
    .string()
    .min(8, 'Use at least 8 characters')
    .max(128, 'Password is too long'),
});

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
