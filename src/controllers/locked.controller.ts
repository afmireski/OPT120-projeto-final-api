import { Request, Response, NextFunction } from 'express';
import { createLocked, deleteLocked, listLocked, checkRoomAvailability } from '../services/locked.service';

export const createLockedHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { room_id, day } = req.body;
  try {
    const dayDate = new Date(day);
    await createLocked({ room_id, day: dayDate });
    res.status(201).json({ message: 'Locked criado com sucesso' });
  } catch (error) {
    next(error);
  }
};

export const deleteLockedHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { room_id, day } = req.params;
  try {
    await deleteLocked(Number(room_id), new Date(day));
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

export const listLockedHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lockedList = await listLocked();
    res.status(200).json(lockedList);
  } catch (error) {
    next(error);
  }
};

export const checkRoomAvailabilityHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { room_id, day } = req.params;
  try {
    const available = await checkRoomAvailability(Number(room_id), new Date(day));
    res.status(200).json({ available });
  } catch (error) {
    next(error);
  }
};
