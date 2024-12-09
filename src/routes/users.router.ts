import { Router } from 'express';
import { loginHandler } from '../controllers/authentication.controller';
import { internalErrorsMiddleware } from '../middlewares/errors.middleware';
import { validatorMiddleware } from '../middlewares/validators.middleware';
import { registerSchema } from '../validators/users/users.schemas';

export const router = Router();

router.post(
  '/api/users/create_account',
  validatorMiddleware(registerSchema, 1),
  loginHandler,
  internalErrorsMiddleware,
);

export default router;
