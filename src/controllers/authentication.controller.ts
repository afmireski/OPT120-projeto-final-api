import { NextFunction, Request, Response } from 'express';
import { login } from '../services/authentication.service';

export const loginHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    body: { email, ra, password },
  } = req;

  return login({ email, ra, password })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((e) => {
      next(e);
    });
};
