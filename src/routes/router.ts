import { Router } from 'express';

import authRouter from './auth.router';
import usersRouter from './users.router';
import roomsRouter from './rooms.router';
import hoursRouter from './hours.router';

export const router = Router();

router
  .use(authRouter)
  .use('/api', usersRouter)
  .use('/api', roomsRouter)
  .use('/api', hoursRouter);

export default router;
