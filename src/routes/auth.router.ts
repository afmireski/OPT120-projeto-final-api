import { Router } from 'express';
import { loginHandler } from '../controllers/authentication.controller';
import { internalErrorsMiddleware } from '../middlewares/errors.middleware';
import { validatorMiddleware } from '../middlewares/validators.middleware';
import { loginSchema } from '../validators/authentication/authentication.schemas';

export const router = Router();

router.post(
  '/login',
  validatorMiddleware(loginSchema, 1),
  loginHandler,
  internalErrorsMiddleware,
);

export default router;
