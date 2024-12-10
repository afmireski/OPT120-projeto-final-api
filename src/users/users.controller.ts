import { NextFunction, Request, Response } from 'express';
import { alterUser, register } from './users.service';
import { InternalError } from '../errors/internal.error';

export const RegisterHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    body: { email, ra, password, user_role },
  } = req;

  return register({ email, ra, password, user_role })
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
  const {
    body: { email, password, name },
    user,
  } = req;

  if (!user) {
    throw new InternalError(2);
  }

  const x = user.id;

  return alterUser({ email, password, name }, x)
    .then(() => {
      res.status(201).json();
    })
    .catch((e) => {
      next(e);
    });
};
