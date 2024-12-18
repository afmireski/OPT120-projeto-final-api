import { NextFunction, Request, Response } from 'express';
import {
  findRoomById,
  deleteRoom,
  listRooms,
  updateRoom,
  createRoom,
} from '../services/rooms.service';
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

export const findRoomByIdHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    params: { id: roomId },
  } = req;

  return findRoomById(Number(roomId))
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((e) => {
      next(e);
    });
};

export const deleteRoomHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    params: { id: roomId },
  } = req;

  return deleteRoom(Number(roomId))
    .then(() => {
      res.status(204).json();
    })
    .catch((e) => {
      next(e);
    });
};

export const createRoomHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    body: { name, informations, opening_hour, closing_hour},
  } = req;

  const input = {
    name,
    informations,
    opening_hour,
    closing_hour,
  };

  return createRoom(input)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((e) => {
      next(e);
    });
};