import { NextFunction, Request, Response } from 'express';
import { InternalError } from '../errors/internal.error';
import { ExtraFields } from '../types/types';

export const extraFieldsMiddleware = (
  fields: Array<keyof typeof ExtraFields>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { query } = req;

    fields.forEach((field) => {
      if (query[field]) {
        try {
          req[field] = JSON.parse(query[field] as string);
        } catch (_e) {
          const error = new InternalError(1, [
            `O campo ${field} apresenta um formato inválido`,
          ]);
          res.status(error.httpCode).json(error);
          return;
        }
      }
    });

    next();
  };
};
