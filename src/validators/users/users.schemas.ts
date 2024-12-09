import { z } from 'zod';

export const registerAdminSchema = z.object({
  body: z.object({
    email: z.string().email(),
    name: z.string().min(3).max(200),
    password: z.string().min(6),
  }),
});

export const findUserByIdSchema = z.object({
  params: z.object({
    id: z
      .string({
        message: 'Id inválido',
      })
      .regex(/^\d+$/, {
        message: 'Id deve ser um número válido',
      }),
  }),
});
