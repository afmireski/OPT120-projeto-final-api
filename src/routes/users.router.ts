import { Router } from 'express';
import {
  findUserByIdHandler,
  registerAdminHandler,
} from '../controllers/users.controller';
import { authenticationMiddleware } from '../middlewares/authentication.middleware';
import { internalErrorsMiddleware } from '../middlewares/errors.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { alterUserHandler, RegisterHandler } from '../users/users.controller';
import { validatorMiddleware } from '../middlewares/validators.middleware';
import {
  findUserByIdSchema,
  registerAdminSchema,
  registerSchema,
  alterUserSchema,
} from '../validators/users/users.schemas';

export const router = Router();

router.post(
  '/users/new-admin',
  authenticationMiddleware,
  roleMiddleware(['ADMIN']),
  validatorMiddleware(registerAdminSchema, 1),
  registerAdminHandler,
  internalErrorsMiddleware,
);

router.get(
  '/users/:id',
  authenticationMiddleware,
  roleMiddleware(['ADMIN', 'SERVANT', 'STUDENT']),
  validatorMiddleware(findUserByIdSchema, 1),
  findUserByIdHandler,
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
