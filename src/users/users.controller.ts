import { NextFunction, Request, Response } from 'express';
import { register } from './users.service';

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
