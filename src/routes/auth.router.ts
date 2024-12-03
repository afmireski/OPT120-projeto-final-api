import { Request, Router } from 'express';
import { loginHandler } from '../controllers/authentication.controller';
import { internalErrorsMiddleware } from '../middlewares/errors.middleware';
import { validatorMiddleware } from '../middlewares/validators.middleware';
import { loginSchema } from '../validators/authentication/authentication.schemas';
import { authenticationMiddleware } from '../middlewares/authentication.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

export const router = Router();

router.post(
  '/login',
  validatorMiddleware(loginSchema, 1),
  loginHandler,
  internalErrorsMiddleware,
);

router.get(
  '/x',
  authenticationMiddleware,
  roleMiddleware(['STUDENT', 'ADMIN']),
  (req: Request, res) => {
    console.log(req.user);

    res.status(204).json();
  },
);

export default router;
