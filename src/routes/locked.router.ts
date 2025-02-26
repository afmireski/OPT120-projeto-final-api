import { Router } from 'express';
import { createLockedHandler, deleteLockedHandler, listLockedHandler, checkRoomAvailabilityHandler } from '../controllers/locked.controller';
import { authenticationMiddleware } from '../middlewares/authentication.middleware';
import { internalErrorsMiddleware } from '../middlewares/errors.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

export const router = Router();

router.post(
  '/locked',
  authenticationMiddleware,
  roleMiddleware(['ADMIN']),
  createLockedHandler,
  internalErrorsMiddleware,
);

router.delete(
  '/locked/:room_id/:day',
  authenticationMiddleware,
  roleMiddleware(['ADMIN']),
  deleteLockedHandler,
  internalErrorsMiddleware,
);

router.get(
  '/locked',
  authenticationMiddleware,
  roleMiddleware(['ADMIN']),
  listLockedHandler,
  internalErrorsMiddleware,
);

router.get(
  '/locked/check/:room_id/:day',
  authenticationMiddleware,
  checkRoomAvailabilityHandler,
  internalErrorsMiddleware,
);

export default router;
