import { NextFunction, Request, Response } from 'express';
import { InternalError } from '../errors/internal.error';
import { UserRole } from '../models/users.model';

export const roleMiddleware = (roles: Array<keyof typeof UserRole>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;

    if (!user || !roles.includes(user?.role)) {
      const error = new InternalError(4);
      res.status(error.httpCode).json(error);
      return;
    }

    next();
  };
};
