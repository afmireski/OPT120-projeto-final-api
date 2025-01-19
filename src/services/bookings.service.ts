import { InternalError } from '../errors/internal.error';
import { Booking } from '../types/bookings.types';
import { KnexService } from './knex.service';

export const approveBookingIntent = async (
  booking_id: number,
): Promise<Booking> => {
  const knex = KnexService.getInstance().knex;

  const query = knex('bookings')
    .update({
      approved: true,
      updated_at: knex.fn.now(),
    })
    .where('id', booking_id)
    .where('approved', false)
    .where('day', '>=', knex.fn.now())
    .whereNotNull('user_id')
    .whereNull('deleted_at')
    .returning('*');

  return query.then(([result]) => {
    if (!result) {
      throw new InternalError(405);
    }

    return result;
  });
};

export const rejectBookingIntent = async (
  booking_id: number,
): Promise<Booking> => {
  const knex = KnexService.getInstance().knex;

  const query = knex('bookings')
    .update({
      user_id: null,
      approved: false,
      updated_at: knex.fn.now(),
    })
    .where('id', booking_id)
    .where('approved', false)
    .where('day', '>=', knex.fn.now())
    .whereNotNull('user_id')
    .whereNull('deleted_at')
    .returning('*');

  return query.then(([result]) => {
    if (!result) {
      throw new InternalError(406);
    }

    return result;
  });
};

export const cancelBookingIntent = async (
  booking_id: number,
  user_id: number,
): Promise<void> => {
  const knex = KnexService.getInstance().knex;

  const query = knex('bookings')
    .update({
      user_id: null,
      approved: false,
      updated_at: knex.fn.now(),
    })
    .where('id', booking_id)
    .where('user_id', user_id)
    .where('day', '>=', knex.fn.now())
    .whereNull('deleted_at');

  return query.then((result) => {
    if (!result) {
      throw new InternalError(407);
    }
  });
};
