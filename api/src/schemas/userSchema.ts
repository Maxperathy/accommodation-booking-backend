/**
 * Node modules
 */
import { z } from 'zod';

/**
 * Custom modules
 */
import { User } from '@/models/user';

const baseRegisterSchema = z.object({
  fullname: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long'),
  email: z.email('Invalid email address').trim(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = baseRegisterSchema.refine(
  async (data) => {
    const userExists = await User.exists({ email: data.email });
    return !userExists;
  },
  {
    message: 'User email or password is invalid',
    path: ['email'],
  },
);

export const loginSchema = z.object({
  email: z.email('Invalid email address').trim(),
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenCookieSchema = z.object({
  refreshToken: z
    .string()
    .min(1, 'Refresh token is required')
    .refine((token) => token.split('.').length === 3, {
      message: 'Invalid refresh token format',
    }),
});

export type registerSchemaType = z.infer<typeof registerSchema>;
export type loginSchemaType = z.infer<typeof loginSchema>;
