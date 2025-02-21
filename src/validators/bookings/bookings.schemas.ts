import { z } from 'zod';

import {
  numberRelationSchema,
  paginationSchema,
  stringRelationSchema,
} from '../geral.schemas';

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

export const rejectBookingIntentSchema = z.object({
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

export const cancelBookingIntentSchema = z.object({
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

export const excludeBookingSchema = z.object({
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

export const listBookingsSchema = z.object({
  filters: z
    .object({
      id: numberRelationSchema.optional(),
    })
    .optional(),
  pagination: paginationSchema.optional(),
});
