import { Request, Response, NextFunction } from 'express';
import { InternalError } from '../errors/internal.error';
import * as jwt from 'jsonwebtoken';
import { verifyToken } from '../utils/jwt.utils';

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    const error = new InternalError(2);
    return res.status(error.httpCode).json(error);
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
    const error = new InternalError(2, e.message);
    return res.status(error.httpCode).json(error);
  }
}