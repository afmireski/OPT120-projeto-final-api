import { z } from 'zod';

export const updateRoomSchema = z.object({
  params: z
    .object({
      id: z
        .string({
          message: 'Id inválido',
        })
        .regex(/^\d+$/, {
          message: 'Id deve ser um número válido',
        }),
    })
    .strict(),
  body: z
    .object({
      name: z.string().min(3).max(200).optional(),
      informations: z.record(z.unknown()).optional(),
      opening_hour: z
        .string()
        .time({
          precision: 0,
        })
        .optional(),
      closing_hour: z
        .string()
        .time({
          precision: 0,
        })
        .optional(),
    })
    .strict(),
});
