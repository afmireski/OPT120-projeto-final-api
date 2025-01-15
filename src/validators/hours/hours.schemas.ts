import { z } from 'zod';

export const listAvailabilityHoursSchema = z.object({
  query: z.object({
    room_id: z.string().regex(/^\d+$/, 'room_id must be a numeric string'),
    day_of_week: z
      .string()
      .regex(/^[1-7]$/, 'day_of_week must be a string between 1 and 7'),
  }),
});
