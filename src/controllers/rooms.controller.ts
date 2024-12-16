import { NextFunction, Request, Response } from 'express';
import { listRooms, updateRoom } from '../services/rooms.service';
import { ListRoomsFilters } from '../types/rooms.types';

export const listRoomsHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { filters: filter, pagination } = req;

  const input = {
    filter: filter as ListRoomsFilters,
    pagination,
  };

  return listRooms(input)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((e) => {
      next(e);
    });
};

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
