import { NextFunction, Request, Response } from 'express';
import { updateRoom } from '../services/rooms.service';

export const updateRoomHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    params: { id: roomId },
    body: { name, informations, opening_hour, closing_hour },
  } = req;

  const input = {
    name,
    informations,
    opening_hour,
    closing_hour,
  };

  return updateRoom(Number(roomId), input)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((e) => {
      next(e);
    });
};
