import * as dfns from 'date-fns';
import { InternalError } from '../errors/internal.error';
import { UserRole } from '../models/users.model';
import {
  Booking,
  CreateBookingIntentInput,
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

  const findIntentQuery = knex({ b: 'bookings' })
    .select('b.*')
    .where('b.id', booking_id)
    .whereNull('deleted_at')
    .first();

  const query = knex('bookings')
    .update({
      state: 'APPROVED',
      updated_at: knex.fn.now(),
      approved_at: knex.fn.now(),
    })
    .where('id', booking_id)
    .where('day', '>=', knex.fn.now())
    .where('state', 'PENDING')
    .whereNull('deleted_at')
    .returning('*');

  return findIntentQuery
    .then(async (intent) => {
      if (!intent) {
        throw new InternalError(401);
      }

      const hasApprovedBooking = !!(await knex({ b: 'bookings' })
        .select('b.*')
        .where('b.room_id', intent.room_id)
        .where('b.hour_id', intent.hour_id)
        .where('b.day', intent.day)
        .where('b.state', 'APPROVED')
        .whereNot('b.id', booking_id)
        .whereNull('b.deleted_at')
        .first());

      if (hasApprovedBooking) {
        throw new InternalError(408);
      }

      return query;
    })
    .then(([result]) => {
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
      state: 'REJECTED',
      updated_at: knex.fn.now(),
      rejected_at: knex.fn.now(),
    })
    .where('id', booking_id)
    .where('day', '>=', knex.fn.now())
    .whereIn('state', ['PENDING', 'APPROVED'])
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
      state: 'CANCELED',
      updated_at: knex.fn.now(),
      canceled_at: knex.fn.now(),
    })
    .where('id', booking_id)
    .where('user_id', user_id)
    .where('day', '>=', knex.fn.now())
    .whereIn('state', ['PENDING', 'APPROVED'])
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

  const countQuery = knex({ b: 'bookings' })
    .count({ total: 'r.id' })
    .innerJoin({ h: 'hours' }, 'h.id', 'b.hour_id')
    .innerJoin({ r: 'rooms' }, 'r.id', 'b.room_id')
    .innerJoin({ u: 'users' }, 'u.id', 'b.user_id')
    .where('b.user_id', userId)
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

export const getRoomBookings = async (
  input: ListRoomBookingsInput,
): Promise<MetadataArray<ListBooking>> => {
  const { room_id, filter, pagination } = input;

  const knex = KnexService.getInstance().knex;

  const countQuery = knex({ b: 'bookings' })
    .count({ total: 'r.id' })
    .innerJoin({ h: 'hours' }, 'h.id', 'b.hour_id')
    .innerJoin({ r: 'rooms' }, 'r.id', 'b.room_id')
    .innerJoin({ u: 'users' }, 'u.id', 'b.user_id')
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

export const createBookingIntent = async (
  input: CreateBookingIntentInput,
): Promise<Booking> => {
  const knex = KnexService.getInstance().knex;

  const { user_id, user_role, room_id, hour_id, date } = input;

  const checkHourQuery = knex({ h: 'hours' })
    .select('h.*')
    .where('id', hour_id)
    .first();

  const checkExistingBookingsQuery = knex({ b: 'bookings' })
    .select('b.*', 'u.role as user_role', 'h.week_day')
    .innerJoin({ h: 'hours' }, 'h.id', 'b.hour_id')
    .innerJoin({ u: 'users' }, 'u.id', 'b.user_id')
    .where('b.room_id', room_id)
    .where('b.hour_id', hour_id)
    .where('b.day', date)
    .whereNotIn('b.state', ['REJECTED', 'CANCELED'])
    .whereNull('b.deleted_at');

  const upperRoles: Array<keyof typeof UserRole> = ['SERVANT', 'ADMIN'];

  return Promise.all([checkHourQuery, checkExistingBookingsQuery])
    .then(([hour, existingBookings]) => {
      if (!hour) {
        throw new InternalError(301);
      }

      const dateOfBooking = new Date(date);
      const dayOfBooking = dfns.getDay(dateOfBooking) + 1;
      const now = new Date();

      if (dfns.isAfter(now, dateOfBooking)) {
        throw new InternalError(409);
      } else if (dayOfBooking !== hour.week_day) {
        throw new InternalError(410);
      }

      if (user_role === 'STUDENT') {
        // Verifica se já existem reservas
        if (existingBookings.length) {
          // Se houver alguma reserva de um professor ou administrador,
          // ou se houver uma reserva aprovada, não permite a reserva por um aluno.
          const hasApprovedBooking = existingBookings.some(
            (booking) =>
              upperRoles.includes(booking.user_role) ||
              booking.state === 'APPROVED',
          );

          if (hasApprovedBooking) {
            throw new InternalError(408);
          }
        }

        // Cria uma reserva pendente para o aluno
        const insertQuery = knex('bookings')
          .insert({
            user_id,
            room_id,
            hour_id,
            day: date,
            state: 'PENDING',
          })
          .returning('*');

        return insertQuery;
      }

      return knex.transaction((trx) => {
        // Cria uma reserva aprovada
        const insertQuery = trx('bookings')
          .insert({
            user_id,
            room_id,
            hour_id,
            day: date,
            state: 'APPROVED',
          })
          .returning('*');

        const queries: Array<Promise<any>> = [insertQuery];
        // Verifica se já existem reservas
        if (existingBookings.length) {
          // Se houver alguma reserva de um professor, ou administrador, aprovada,
          // impede a reserva
          const hasApprovedBooking = existingBookings.some(
            (booking) =>
              upperRoles.includes(booking.user_role) &&
              booking.state === 'APPROVED',
          );

          if (hasApprovedBooking) {
            throw new InternalError(408);
          }

          // Rejeita todas as outras reservas pendentes,
          // inclusive reservas aprovadas de alunos
          const rejectBookingsQuery = trx('bookings')
            .update({
              state: 'REJECTED',
              updated_at: knex.fn.now(),
              rejected_at: knex.fn.now(),
            })
            .where('room_id', room_id)
            .where('hour_id', hour_id)
            .where('day', date)
            .whereNot('state', 'CANCELED')
            .whereNot('user_id', user_id)
            .whereNull('deleted_at');

          queries.push(rejectBookingsQuery);
        }

        return Promise.all(queries).then(([booking]) => booking);
      });
    })
    .then(([result]) => {
      return result as Booking;
    });
};

export const getBookings = async (
  input: ListBookingsInput,
): Promise<MetadataArray<ListBooking>> => {
  const { filter, pagination } = input;

  const knex = KnexService.getInstance().knex;

  const countQuery = knex({ b: 'bookings' })
    .count({ total: 'r.id' })
    .innerJoin({ h: 'hours' }, 'h.id', 'b.hour_id')
    .innerJoin({ r: 'rooms' }, 'r.id', 'b.room_id')
    .innerJoin({ u: 'users' }, 'u.id', 'b.user_id')
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
