import { NextFunction, Request, Response } from 'express';

export const paginationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { pagination } = req;

  const { limit = 20, page = 1 } = pagination ?? {};
  const offset = (page - 1) * limit;
  req.pagination = { limit, page, offset };

  next();
};
