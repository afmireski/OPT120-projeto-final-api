import { Router } from 'express';
import { internalErrorsMiddleware } from '../middlewares/errors.middleware';
import { validatorMiddleware } from '../middlewares/validators.middleware';
import { registerAdminHandler } from '../controllers/users.controller';
import { registerAdminSchema } from '../validators/users/users.schemas';

export const router = Router();

router.post(
  '/users/new-admin',
  validatorMiddleware(registerAdminSchema, 1),
  registerAdminHandler,
  internalErrorsMiddleware,
);

export default router;
