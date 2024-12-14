import { Router } from 'express';

import authRouter from './auth.router';
import usersRouter from './users.router';
import roomsRouter from './rooms.router';

export const router = Router();

router.use(authRouter).use('/api', usersRouter).use('/api', roomsRouter);

export default router;
