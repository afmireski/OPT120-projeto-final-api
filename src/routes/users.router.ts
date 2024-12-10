import { Router } from 'express';
import {
  alterUserHandler,
  findUserByIdHandler,
  registerAdminHandler,
  registerHandler,
} from '../controllers/users.controller';
import { authenticationMiddleware } from '../middlewares/authentication.middleware';
import { internalErrorsMiddleware } from '../middlewares/errors.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
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
  '/users/create-account',
  validatorMiddleware(registerSchema, 1),
  registerHandler,
  internalErrorsMiddleware,
);

router.patch(
  '/users/alter-user',
  authenticationMiddleware,
  validatorMiddleware(alterUserSchema, 1),
  alterUserHandler,
  internalErrorsMiddleware,
);

export default router;
