import { z } from 'zod';

export const approveBookingIntentSchema = z.object({
  params: z
    .object({
      booking_id: z
        .string({
          message: 'Id inválido',
        })
        .regex(/^\d+$/, {
          message: 'Id deve ser um número válido',
        }),
    })
    .strict(),
});
