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
