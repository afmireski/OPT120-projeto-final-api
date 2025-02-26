import { z } from 'zod';
import {
  dateRelationSchema,
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
      'b.id': numberRelationSchema.optional(),
      'b.day': dateRelationSchema.optional(),
      'b.state': stringRelationSchema.optional(),
      'b.room_id': numberRelationSchema.optional(),
      'r.name': stringRelationSchema.optional(),
      'u.name': stringRelationSchema.optional(),
      'u.email': stringRelationSchema.optional(),
      'u.ra': stringRelationSchema.optional(),
      'b.hour_id': numberRelationSchema.optional(),
      'h.week_day': numberRelationSchema.optional(),
      'u.role': stringRelationSchema.optional(),
    })
    .optional(),
  pagination: paginationSchema.optional(),
});

export const listBookingsSchema = z.object({
  filters: z
    .object({
      'b.id': numberRelationSchema.optional(),
      'b.day': dateRelationSchema.optional(),
      'b.state': stringRelationSchema.optional(),
      'b.room_id': numberRelationSchema.optional(),
      'r.name': stringRelationSchema.optional(),
      'u.name': stringRelationSchema.optional(),
      'u.email': stringRelationSchema.optional(),
      'u.ra': stringRelationSchema.optional(),
      'b.hour_id': numberRelationSchema.optional(),
      'h.week_day': numberRelationSchema.optional(),
      'u.role': stringRelationSchema.optional(),
    })
    .optional(),
  pagination: paginationSchema.optional(),
});

export const createBookingIntentSchema = z.object({
  body: z.object({
    room_id: z.number().int().positive(),
    hour_id: z.number().int().positive(),
    date: z.string().date(),
  }),
});

export const getBookingsSchema = z.object({
  filters: z
    .object({
      'b.id': numberRelationSchema.optional(),
      'b.day': dateRelationSchema.optional(),
      'b.state': stringRelationSchema.optional(),
      'b.room_id': numberRelationSchema.optional(),
      'r.name': stringRelationSchema.optional(),
      'u.name': stringRelationSchema.optional(),
      'u.email': stringRelationSchema.optional(),
      'u.ra': stringRelationSchema.optional(),
      'b.hour_id': numberRelationSchema.optional(),
      'h.week_day': numberRelationSchema.optional(),
      'u.role': stringRelationSchema.optional(),
    })
    .optional(),
  pagination: paginationSchema.optional(),
});
