import { Router } from 'express';
import { updateRoomHandler } from '../controllers/rooms.controller';
import { authenticationMiddleware } from '../middlewares/authentication.middleware';
import { internalErrorsMiddleware } from '../middlewares/errors.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validatorMiddleware } from '../middlewares/validators.middleware';
import { updateRoomSchema } from '../validators/rooms/rooms.schemas';

export const router = Router();

router.patch(
  '/rooms/:id/update',
  authenticationMiddleware,
  roleMiddleware(['ADMIN']),
  validatorMiddleware(updateRoomSchema, 1),
  updateRoomHandler,
  internalErrorsMiddleware,
);

export default router;
