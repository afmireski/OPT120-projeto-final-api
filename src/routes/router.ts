import { Router } from 'express';

import authRouter from './auth.router';
import usersRouter from './users.router';


export const router = Router();

router.use(authRouter);
router.use(usersRouter)

export default router;
