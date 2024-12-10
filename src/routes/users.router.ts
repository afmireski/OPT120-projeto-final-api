import { Router } from 'express';
import {
  alterUserSchema,
  registerSchema,
} from '../validators/users/users.schemas';
import { internalErrorsMiddleware } from '../middlewares/errors.middleware';
import { validatorMiddleware } from '../middlewares/validators.middleware';
import { registerAdminHandler } from '../controllers/users.controller';
import { registerAdminSchema } from '../validators/users/users.schemas';
import { authenticationMiddleware } from '../middlewares/authentication.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { alterUserHandler, RegisterHandler } from '../users/users.controller';

export const router = Router();

router.post(
  '/users/new-admin',
  authenticationMiddleware,
  roleMiddleware(['ADMIN']),
  validatorMiddleware(registerAdminSchema, 1),
  registerAdminHandler,
  internalErrorsMiddleware,
);

router.post(
  '/api/users/create_account',
  validatorMiddleware(registerSchema, 1),
  RegisterHandler,
  internalErrorsMiddleware,
);

router.put(
  '/api/users/alter_user',
  authenticationMiddleware,
  validatorMiddleware(alterUserSchema, 1),
  alterUserHandler,
  internalErrorsMiddleware,
);

export default router;
