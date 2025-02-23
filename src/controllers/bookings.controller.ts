import { NextFunction, Request, Response } from 'express';
import {
  approveBookingIntent,
  cancelBookingIntent,
  createBookingIntent,
  excludeBooking,
  findBookingsByUserId,
  getBookings,
  getRoomBookings,
  rejectBookingIntent,
} from '../services/bookings.service';
import {
  CreateBookingIntentInput,
  ListBookingsFilters,
  ListBookingsInput,
  ListRoomBookingsInput,
} from '../types/bookings.types';

export const approveBookingIntentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    params: { booking_id },
  } = req;

  return approveBookingIntent(Number(booking_id))
    .then((booking) => {
      res.status(200).json(booking);
    })
    .catch((e) => {
      next(e);
    });
};

export const rejectBookingIntentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    params: { booking_id },
  } = req;

  return rejectBookingIntent(Number(booking_id))
    .then((booking) => {
      res.status(200).json(booking);
    })
    .catch((e) => {
      next(e);
    });
};

export const cancelBookingIntentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    params: { booking_id },
    user,
  } = req;

  const userId = user!.id;

  return cancelBookingIntent(Number(booking_id), userId)
    .then(() => {
      res.status(200).json();
    })
    .catch((e) => {
      next(e);
    });
};

export const excludeBookingHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    params: { booking_id },
  } = req;

  return excludeBooking(Number(booking_id))
    .then(() => {
      res.status(200).json();
    })
    .catch((e) => {
      next(e);
    });
};

export const getRoomBookingsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    params: { room_id },
    filters: filter,
    pagination,
  } = req;

  const input: ListRoomBookingsInput = {
    room_id: Number(room_id),
    filter: filter as ListBookingsFilters,
    pagination,
  };

  return getRoomBookings(input)
    .then((bookings) => {
      res.status(200).json(bookings);
    })
    .catch((e) => {
      next(e);
    });
};

export const findBookingsByUserIdHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    params: { user_id },
  } = req;

  return findBookingsByUserId(Number(user_id))
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((e) => {
      next(e);
    });
};

export const createBookingIntentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { body, user } = req;

  const { id, role } = user!;

  const input: CreateBookingIntentInput = {
    ...body,
    user_id: id,
    user_role: role,
  };

  return createBookingIntent(input)
    .then((booking) => {
      res.status(201).json(booking);
    })
    .catch((e) => {
      next(e);
    });
};

export const getBookingsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { filters: filter, pagination } = req;

  const input: ListBookingsInput = {
    filter: filter as Omit<ListBookingsFilters, 'b.room_id'>,
    pagination,
  };

  return getBookings(input)
    .then((bookings) => {
      res.status(200).json(bookings);
    })
    .catch((e) => {
      next(e);
    });
};
