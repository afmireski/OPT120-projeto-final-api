import { InternalError } from '../errors/internal.error';
import { Booking, ListBookingsInput } from '../types/bookings.types';
import { MetadataArray } from '../types/types';
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

export const excludeBooking = async (booking_id: number): Promise<void> => {
  const knex = KnexService.getInstance().knex;

  const query = knex('bookings')
    .update({
      deleted_at: knex.fn.now(),
    })
    .where('id', booking_id)
    .whereNull('deleted_at');

  return query.then((result) => {
    if (!result) {
      throw new InternalError(404);
    }
  });
};


export const findBookingsByUserId = async (
  userId: number,
  input?: ListBookingsInput,
): Promise<MetadataArray<Booking>> => {
  const knex = KnexService.getInstance().knex;
  const { filter, pagination } = input || {};

  const countQuery = knex('bookings')
    .count({ total: 'id' })
    .where('user_id', userId)
    .whereNull('deleted_at');

  KnexService.appendFiltersToQuery(countQuery, filter);
  console.log('countQuery:', countQuery.toString());

  const countResult = await countQuery.first();
  const total = countResult ? Number(countResult.total) : 0;
  const query = knex('bookings')
    .select('*')
    .where('user_id', userId)
    .whereNull('deleted_at');

  KnexService.appendFiltersToQuery(query, filter);
  KnexService.addPaginationToQuery(query, pagination);
  query.orderBy('id');
  console.log('query:', query.toString());

  const bookings: Booking[] = await query;
  const data = bookings.map(({ deleted_at, ...rest }) => rest);

  return {
    metadata: {
      total,
      page: pagination?.page,
      limit: pagination?.limit,
    },
    data,
  };
};

