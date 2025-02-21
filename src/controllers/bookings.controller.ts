import { NextFunction, Request, Response } from 'express';
import {
  approveBookingIntent,
  cancelBookingIntent,
  rejectBookingIntent,
  excludeBooking,
  findBookingsByUserId,
} from '../services/bookings.service';

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

export const findBookingsByUserIdHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    params: { id: roomId },
  } = req;

  return findBookingsByUserId(Number(roomId))
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((e) => {
      next(e);
    });
};
