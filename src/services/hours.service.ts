import { InternalError } from '../errors/internal.error';
import { AvailabilityHours } from '../types/hours.types';
import { KnexService } from './knex.service';
import * as dfns from 'date-fns';

const DEFAULT_HOUR_INTERVAL_MINUTES = 60;

export const listAvailabilityHours = async (
  roomId: number,
  day_of_week: number,
): Promise<AvailabilityHours> => {
  const knex = KnexService.getInstance().knex;

  const query = knex({
    h: 'hours',
  })
    .innerJoin({ r: 'rooms' }, 'r.id', 'h.room_id')
    .select('h.*', 'r.opening_hour', 'r.closing_hour')
    .where('h.room_id', roomId)
    .where('h.week_day', day_of_week)
    .whereNull('h.deleted_at');

  return query.then((hours) => {
    if (hours.length === 0) {
      throw new InternalError(301);
    }

    const openingHour = dfns.parse(
      hours[0].opening_hour,
      'HH:mm:ss',
      new Date(),
    );
    const closingHour = dfns.parse(
      hours[0].closing_hour,
      'HH:mm:ss',
      new Date(),
    );

    const { intervals, occupiedIntervals } = hours.reduce(
      (acc: any, hour: any) => {
        const interval = {
          id: hour.id,
          opening: dfns.parse(hour.opening, 'HH:mm:ss', new Date()),
          closing: dfns.parse(hour.closing, 'HH:mm:ss', new Date()),
        };
        acc.intervals.push(interval);
        acc.occupiedIntervals.push({
          id: hour.id,
          opening: hour.opening,
          closing: hour.closing,
        });
        return acc;
      },
      { intervals: [], occupiedIntervals: [] },
    );

    const freeIntervals = [];
    let currentTime = openingHour;

    while (dfns.isBefore(currentTime, closingHour)) {
      const closing = dfns.addMinutes(
        currentTime,
        DEFAULT_HOUR_INTERVAL_MINUTES,
      );

      if (
        !intervals.some((interval: any) =>
          dfns.isEqual(currentTime, interval.opening),
        )
      ) {
        freeIntervals.push({
          opening: dfns.format(currentTime, 'HH:mm'),
          closing: dfns.format(closing, 'HH:mm'),
        });
      }

      currentTime = closing;
    }

    return {
      room_id: roomId,
      day_of_week,
      free_intervals: freeIntervals,
      occupied_intervals: occupiedIntervals,
    };
  });
};
