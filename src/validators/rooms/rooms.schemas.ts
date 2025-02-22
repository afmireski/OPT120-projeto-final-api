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

// export const createRoomSchema = z.object({
//   body: z
//     .object({
//       name: z.string().min(3).max(200),
//       informations: z.record(z.unknown()),
//       opening_hour: z
//         .string()
//         .time({
//           precision: 0,
//         }),
//   closing_hour: z
//     .string()
//     .time({
//       precision: 0,
//     }),
// })
//     .strict(),
// });

export const createRoomSchema = z
  .object({
    body: z
      .object({
        name: z.string().min(3).max(200),
        informations: z
          .record(z.unknown())
          .refine(
            (info) => Object.keys(info).length > 0,
            'O campo informações não pode ser vazio',
          ),
        opening_hour: z
          .string()
          .regex(
            /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/,
            'A hora de abertura deve estar no formato HH:MM:SS',
          ),
        closing_hour: z
          .string()
          .regex(
            /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/,
            'A hora de fechamento deve estar no formato HH:MM:SS',
          ),
      })
      .strict(),
  })
  .refine(
    ({ body }) => {
      const { opening_hour, closing_hour } = body;

      if (
        typeof opening_hour === 'string' &&
        typeof closing_hour === 'string'
      ) {
        const [openHours, openMinutes, openSeconds] = opening_hour
          .split(':')
          .map(Number);
        const [closeHours, closeMinutes, closeSeconds] = closing_hour
          .split(':')
          .map(Number);

        const openTimeInSeconds =
          openHours * 3600 + openMinutes * 60 + openSeconds;
        const closeTimeInSeconds =
          closeHours * 3600 + closeMinutes * 60 + closeSeconds;

        return closeTimeInSeconds > openTimeInSeconds;
      }

      return true; // Caso os tipos não sejam strings, pula a validação
    },
    {
      message:
        'A hora de abertura não pode ser maior ou igual à hora de fechamento',
      path: ['body', 'opening_hour'],
    },
  );
