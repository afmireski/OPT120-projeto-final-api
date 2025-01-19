import { NextFunction, Request, Response } from 'express';
import {
  createHours,
  listAvailabilityHours,
  removeHours,
} from '../services/hours.service';

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

export const removeHoursHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    body: { room_id, hours_ids },
  } = req;

  return removeHours(room_id, hours_ids)
    .then(() => {
      res.status(204).json();
    })
    .catch((e) => {
      next(e);
    });
};

export const createHoursHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    body: { room_id, hours: data },
  } = req;

  return createHours({ room_id, data })
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((e) => {
      next(e);
    });
};
