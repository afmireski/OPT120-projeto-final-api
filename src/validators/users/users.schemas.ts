import { z } from 'zod';

export const registerSchema = z.object({
  body: z
    .object({
      email: z.string().email(),
      ra: z
        .string()
        .regex(/^\d{7}$/)
        .optional(),
      password: z.string().min(6),
      role: z.enum(['SERVANT', 'STUDENT']),
    })
    .refine((data) => data.ra && data.role === 'STUDENT', {
      message: 'Ra must be provided',
    }),
});

export const registerAdminSchema = z.object({
  body: z.object({
    email: z.string().email(),
    name: z.string().min(3).max(200),
    password: z.string().min(6),
  }),
});

export const alterUserSchema = z.object({
  body: z
    .object({
      email: z.string().email().optional(),
      password: z.string().min(6).optional(),
      name: z.string().min(3).max(200).optional(),
    })
    .refine((data) => data.email || data.password, {
      message: 'Either email or password must be provided',
    })
    .refine((data) => !(data.email && data.password), {
      message: 'Only one of email or password must be provided',
    }),
});
