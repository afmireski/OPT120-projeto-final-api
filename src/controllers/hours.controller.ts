import { NextFunction, Request, Response } from 'express';
import { listAvailabilityHours } from '../services/hours.service';

export const listAvailabilityHoursHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    query: { room_id, day_of_week },
  } = req;

  return listAvailabilityHours(Number(room_id), Number(day_of_week))
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((e) => {
      next(e);
    });
};
