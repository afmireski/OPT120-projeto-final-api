import { NextFunction, Request, Response } from 'express';
import { RegisterAdminInput } from '../types/users.types';
import { registerAdmin } from '../services/users.service';

export const registerAdminHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { body } = req;

  const input = body as RegisterAdminInput;

  return registerAdmin(input)
    .then(() => {
      res.status(201).json();
    })
    .catch((error) => {
      next(error);
    });
};
