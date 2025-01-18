import { InternalError } from '../errors/internal.error';
import {
  AvailabilityHours,
  CreateHoursInput,
  NewHourData,
} from '../types/hours.types';
import { KnexService } from './knex.service';
import * as dfns from 'date-fns';

const DEFAULT_HOUR_INTERVAL_MINUTES = 60;

export const listAvailabilityHours = async (
  roomId: number,
  dayOfWeek: number,
): Promise<AvailabilityHours> => {
  const knex = KnexService.getInstance().knex;

  const query = knex({
    h: 'hours',
  })
    .innerJoin({ r: 'rooms' }, 'r.id', 'h.room_id')
    .select(
      'r.id',
      'r.opening_hour',
      'r.closing_hour',
      knex.raw('json_agg(h.*) as hours'),
    )
    .where('h.room_id', roomId)
    .where('h.week_day', dayOfWeek)
    .whereNull('h.deleted_at')
    .groupBy('r.id', 'r.opening_hour', 'r.closing_hour')
    .first();

  return query.then((result) => {
    if (!result) {
      throw new InternalError(201);
    }

    const { opening_hour, closing_hour, hours } = result;

    const openingHour = dfns.parse(opening_hour, 'HH:mm:ss', new Date());
    const closingHour = dfns.parse(closing_hour, 'HH:mm:ss', new Date());

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

      const isOccupied = isIntervalOccupied(
        dfns.format(currentTime, 'HH:mm'),
        dfns.format(closing, 'HH:mm'),
        intervals,
        freeIntervals,
      );

      if (!isOccupied) {
        freeIntervals.push({
          opening: dfns.format(currentTime, 'HH:mm'),
          closing: dfns.format(closing, 'HH:mm'),
        });
      }

      currentTime = closing;
    }

    return {
      room_id: roomId,
      day_of_week: dayOfWeek,
      free_intervals: freeIntervals,
      occupied_intervals: occupiedIntervals,
    };
  });
};

export const removeHours = async (roomId: number, hoursIds: number[]) => {
  const knex = KnexService.getInstance().knex;

  return knex('hours')
    .where('room_id', roomId)
    .whereIn('id', hoursIds)
    .whereNull('deleted_at')
    .update({
      deleted_at: new Date(),
    });
};

const isIntervalOccupied = (
  opening: string,
  closing: string,
  intervals: any[],
  acc: any[],
): boolean => {
  const parsedOpening = dfns.parse(opening, 'HH:mm', new Date());
  const parsedClosing = dfns.parse(closing, 'HH:mm', new Date());

  return intervals.some((interval: any) => {
    if (
      dfns.isWithinInterval(parsedOpening, {
        start: interval.opening,
        end: interval.closing,
      }) ||
      dfns.isWithinInterval(parsedClosing, {
        start: interval.opening,
        end: interval.closing,
      })
    ) {
      const conflictWithPassed = acc.some(
        (passedHour: any) =>
          dfns.isWithinInterval(
            dfns.parse(passedHour.opening, 'HH:mm', new Date()),
            {
              start: parsedOpening,
              end: parsedClosing,
            },
          ) ||
          dfns.isWithinInterval(
            dfns.parse(passedHour.closing, 'HH:mm', new Date()),
            {
              start: parsedOpening,
              end: parsedClosing,
            },
          ),
      );

      if (
        dfns.isEqual(parsedClosing, interval.opening) ||
        dfns.isEqual(parsedOpening, interval.closing)
      ) {
        return conflictWithPassed;
      }

      return true;
    }

    return false;
  });
};

export const createHours = async (input: CreateHoursInput) => {
  const { room_id: roomId, data: newHours } = input;

  const knex = KnexService.getInstance().knex;

  const daysSet = new Set(newHours.map((d) => d.day_of_week));

  const query = knex({
    h: 'hours',
  })
    .innerJoin({ r: 'rooms' }, 'r.id', 'h.room_id')
    .select(
      'r.id',
      'h.week_day',
      knex.raw('json_agg(h.*) as hours'),
      'r.opening_hour',
      'r.closing_hour',
    )
    .where('h.room_id', roomId)
    .whereIn('h.week_day', Array.from(daysSet))
    .whereNull('h.deleted_at')
    .groupBy('h.week_day', 'r.id')
    .first();

  return query.then((result) => {
    console.log(result);

    const occupidedIntervals = result.hours.reduce((acc: any, hour: any) => {
      if (!acc[hour.week_day]) {
        acc[hour.week_day] = [];
      }

      acc[hour.week_day].push({
        opening: dfns.parse(hour.opening, 'HH:mm:ss', new Date()),
        closing: dfns.parse(hour.closing, 'HH:mm:ss', new Date()),
      });
      return acc;
    }, {});

    const data = newHours.reduce((validHoues: any, hour: NewHourData) => {
      const { opening, closing, day_of_week } = hour;

      const isOccupied = isIntervalOccupied(
        opening,
        closing,
        occupidedIntervals[hour.day_of_week],
        validHoues,
      );

      if (!isOccupied) {
        validHoues.push({
          room_id: roomId,
          week_day: day_of_week,
          opening,
          closing,
        });

        occupidedIntervals[day_of_week].push({
          opening: dfns.parse(opening, 'HH:mm', new Date()),
          closing: dfns.parse(closing, 'HH:mm', new Date()),
        });
      }

      return validHoues;
    }, []);

    if (data.length === 0) {
      throw new InternalError(305);
    }

    return knex('hours').insert(data).returning('*');
  });
};
