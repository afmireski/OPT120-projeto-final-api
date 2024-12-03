import { z } from 'zod';

export const loginSchema = z.object({
  body: z
    .object({
      email: z.string().email().optional(),
      ra: z
        .string()
        .regex(/^\d{7}$/)
        .optional(),
      password: z.string().min(6),
    })
    .refine((data) => data.email || data.ra, {
      message: 'Either email or ra must be provided',
    })
    .refine((data) => !(data.email && data.ra), {
      message: 'Only one of email or ra must be provided',
    }),
});