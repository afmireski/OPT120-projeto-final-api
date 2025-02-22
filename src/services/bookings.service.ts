import { InternalError } from '../errors/internal.error';
import {
  Booking,
  ListBooking,
  ListBookingsInput,
  ListRoomBookingsInput,
} from '../types/bookings.types';
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

export const getRoomBookings = async (
  input: ListRoomBookingsInput,
): Promise<MetadataArray<ListBooking>> => {
  const { room_id, filter, pagination } = input;

  const knex = KnexService.getInstance().knex;

  const countQuery = knex({ b: 'bookings' })
    .count({ total: 'r.id' })
    .innerJoin({ h: 'hours' }, 'h.id', 'b.hour_id')
    .innerJoin({ r: 'rooms' }, 'r.id', 'b.room_id')
    .leftJoin({ u: 'users' }, 'u.id', 'b.user_id')
    .where('b.room_id', room_id)
    .whereNull('b.deleted_at');

  KnexService.appendFiltersToQuery(countQuery, filter);

  const query = countQuery
    .clone()
    .clearSelect()
    .select(
      'b.*',
      'h.week_day',
      'h.opening',
      'h.closing',
      'r.name as room_name',
      'r.informations as room_informations',
      'r.opening_hour as room_open',
      'r.closing_hour as room_close',
      'u.name as user_name',
      'u.email as user_email',
      'u.ra as user_ra',
      'u.role as user_role',
    );

  countQuery;

  KnexService.addPaginationToQuery(query, pagination);
  query.orderBy('b.day', 'asc');

  return Promise.all([countQuery, query]).then(([[count], data]) => {
    const formattedData = data.map((booking) => {
      const {
        day,
        week_day,
        opening,
        closing,
        room_name,
        room_informations,
        room_open,
        room_close,
        user_name,
        user_email,
        user_ra,
        user_role,
        ...rest
      } = booking;

      return {
        ...rest,
        hour: {
          week_day,
          opening,
          closing,
        },
        room: {
          name: room_name,
          informations: room_informations,
          opening_hour: room_open,
          closing_hour: room_close,
        },
        user: {
          name: user_name,
          email: user_email,
          ra: user_ra,
          role: user_role,
        },
      };
    });

    return {
      metadata: {
        total: Number(count.total),
        page: pagination?.page,
        limit: pagination?.limit,
      },
      data: formattedData,
    };
  });
};
