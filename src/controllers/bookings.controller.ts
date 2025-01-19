import { NextFunction, Request, Response } from 'express';
import { approveBookingIntent } from '../services/bookings.service';

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
