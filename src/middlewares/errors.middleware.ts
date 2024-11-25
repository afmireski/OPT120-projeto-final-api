import { NextFunction, Request, Response } from 'express';
import { InternalError } from '../errors/internal.error';

export const internalErrorsMiddleware = (
  err: any,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void => {
  if (err instanceof InternalError) {
    response.status(err.httpCode).json(err);
    return;
  } else if (err instanceof Error) {
    response.status(500).json(new InternalError(0, [err.message]));
    return;
  }
  response.status(500).json(new InternalError(-1, [JSON.stringify(err)]));
  return;
};
