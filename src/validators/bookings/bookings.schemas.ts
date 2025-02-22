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

export const getRoomBookingsSchema = z.object({
  params: z
    .object({
      room_id: z
        .string({
          message: 'Id inválido',
        })
        .regex(/^\d+$/, {
          message: 'Id deve ser um número válido',
        }),
    })
    .strict(),
  filters: z
    .object({
      week_day: numberRelationSchema.optional(),
      user_role: stringRelationSchema.optional(),
      user_name: stringRelationSchema.optional(),
      user_email: stringRelationSchema.optional(),
      state: stringRelationSchema.optional(),
    })
    .optional(),
  pagination: paginationSchema.optional(),
});
