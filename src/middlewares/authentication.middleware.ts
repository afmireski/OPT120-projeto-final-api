import { Request, Response, NextFunction } from 'express';
import { InternalError } from '../errors/internal.error';
import { verifyToken } from '../utils/jwt.utils';

export function authenticationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new InternalError(2);
    }

    const decodedToken = verifyToken(authorization);

    if (!decodedToken) {
      throw new InternalError(3);
    }

    req.user = decodedToken.user;
    next();
  } catch (e) {
    if (e instanceof InternalError) {
      res.status(e.httpCode).json(e);
      return;
    }

    const error = new InternalError(2, (e as any).message);
    res.status(error.httpCode).json(error);
    return;
  }
}
