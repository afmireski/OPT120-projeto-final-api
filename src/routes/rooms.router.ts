import { Router } from 'express';
import {
  deleteRoomHandler,
  listRoomsHandler,
  updateRoomHandler,
} from '../controllers/rooms.controller';
import { authenticationMiddleware } from '../middlewares/authentication.middleware';
import { internalErrorsMiddleware } from '../middlewares/errors.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validatorMiddleware } from '../middlewares/validators.middleware';
import {
  deleteRoomSchema,
  listRoomsSchema,
  updateRoomSchema,
} from '../validators/rooms/rooms.schemas';
import { extraFieldsMiddleware } from '../middlewares/extraFields.middleware';
import { paginationMiddleware } from '../middlewares/pagination.middleware';

export const router = Router();

router.get(
  '/rooms',
  authenticationMiddleware,
  roleMiddleware(['ADMIN', 'SERVANT', 'STUDENT']),
  extraFieldsMiddleware(['filters', 'pagination']),
  validatorMiddleware(listRoomsSchema, 1),
  paginationMiddleware,
  listRoomsHandler,
  internalErrorsMiddleware,
);

router.patch(
  '/rooms/:id/update',
  authenticationMiddleware,
  roleMiddleware(['ADMIN']),
  validatorMiddleware(updateRoomSchema, 1),
  updateRoomHandler,
  internalErrorsMiddleware,
);

router.delete(
  '/rooms/:id/del',
  authenticationMiddleware,
  roleMiddleware(['ADMIN']),
  validatorMiddleware(deleteRoomSchema, 1),
  deleteRoomHandler,
  internalErrorsMiddleware,
);
export default router;
