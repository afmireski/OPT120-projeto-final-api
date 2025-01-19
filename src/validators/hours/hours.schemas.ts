import { z } from 'zod';

export const listAvailabilityHoursSchema = z.object({
  query: z.object({
    room_id: z.string().regex(/^\d+$/, 'room_id must be a numeric string'),
    day_of_week: z
      .string()
      .regex(/^[1-7]$/, 'day_of_week must be a string between 1 and 7'),
  }),
});

export const removeHoursSchema = z.object({
  body: z.object({
    room_id: z.number().min(1),
    hours_ids: z.array(z.number().min(1)),
  }),
});

export const createHoursSchema = z.object({
  params: z.object({
    room_id: z.string().regex(/^\d+$/, 'room_id must be a numeric string'),
  }),
  body: z.object({
    hours: z.array(
      z.object({
        day_of_week: z.number().min(1).max(7),
        opening: z
          .string()
          .regex(/^\d{2}:\d{2}$/, 'opening must be in HH:MM format'),
        closing: z
          .string()
          .regex(/^\d{2}:\d{2}$/, 'closing must be in HH:MM format'),
      }),
    ),
  }),
});
