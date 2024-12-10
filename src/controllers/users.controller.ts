import { NextFunction, Request, Response } from 'express';
import { RegisterAdminInput } from '../types/users.types';
import { findUserById, registerAdmin } from '../services/users.service';

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

export const findUserByIdHandler = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const {
    params: { id },
  } = request;

  const userId = Number(id);

  return findUserById(userId)
    .then((user) => {
      response.status(200).json(user);
    })
    .catch((error) => {
      next(error);
    });
};
