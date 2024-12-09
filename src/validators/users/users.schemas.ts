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
