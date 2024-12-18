import { z } from 'zod';
import {
  numberRelationSchema,
  paginationSchema,
  stringRelationSchema,
} from '../geral.schemas';

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

export const deleteRoomSchema = z.object({
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
});

export const listRoomsSchema = z.object({
  filters: z
    .object({
      id: numberRelationSchema.optional(),
      name: stringRelationSchema.optional(),
    })
    .optional(),
  pagination: paginationSchema.optional(),
});

export const findRoomByIdSchema = z.object({
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
});
