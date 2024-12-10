import { NextFunction, Request, Response } from 'express';
import {
  alterUser,
  findUserById,
  register,
  registerAdmin,
} from '../services/users.service';
import { RegisterAdminInput } from '../types/users.types';

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

export const registerHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { body } = req;

  return register(body)
    .then(() => {
      res.status(201).json();
    })
    .catch((e) => {
      next(e);
    });
};

export const alterUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { body, user } = req;

  const userId = user!.id;

  return alterUser(body, userId)
    .then(() => {
      res.status(200).json();
    })
    .catch((e) => {
      next(e);
    });
};
