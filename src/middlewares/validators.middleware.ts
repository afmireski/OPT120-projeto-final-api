import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { InternalError } from '../errors/internal.error';

export const validatorMiddleware = (schema: ZodSchema, errorCode: number) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req);
      next();
    } catch (e) {
      if (e instanceof ZodError) {
        const messages = e.errors.map(
          (error) => `${error.path[1]}: ${error.message}`,
        );
        next(new InternalError(errorCode, messages));
        return;
      }
      next(new InternalError(errorCode, ['Falha ao validar a entrada']));
    }
  };
};
