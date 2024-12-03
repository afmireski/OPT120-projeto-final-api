import { Request, Response, NextFunction } from 'express';
import { InternalError } from '../errors/internal.error';
import { verifyToken } from '../utils/jwt.utils';

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    next(new InternalError(2));
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = verifyToken(token);

    if (!decodedToken) {
      throw new InternalError(3);
    }

    req.user = decodedToken.user;
    next();
  } catch (e: any) {
    next(new InternalError(2, e.message));
  }
}
