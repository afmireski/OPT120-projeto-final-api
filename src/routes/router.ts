import { Router } from 'express';

import authRouter from './auth.router';
import usersRouter from './users.router';

export const router = Router();

router.use(authRouter).use('/api', usersRouter);

export default router;
