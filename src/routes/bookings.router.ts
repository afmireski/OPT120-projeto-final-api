import { Router } from 'express';
import {
  approveBookingIntentHandler,
  cancelBookingIntentHandler,
  rejectBookingIntentHandler,
  excludeBookingHandler,
  findBookingsByUserIdHandler,
  getRoomBookingsHandler,
  createBookingIntentHandler,
  getBookingsHandler,
} from '../controllers/bookings.controller';
import { authenticationMiddleware } from '../middlewares/authentication.middleware';
import { internalErrorsMiddleware } from '../middlewares/errors.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validatorMiddleware } from '../middlewares/validators.middleware';
import { extraFieldsMiddleware } from '../middlewares/extraFields.middleware';
import { paginationMiddleware } from '../middlewares/pagination.middleware';
import {
  approveBookingIntentSchema,
  rejectBookingIntentSchema,
  excludeBookingSchema,
  getRoomBookingsSchema,
  listBookingsSchema,
  createBookingIntentSchema,
  cancelBookingIntentSchema,
  getBookingsSchema,
} from '../validators/bookings/bookings.schemas';

export const router = Router();

router.post(
  '/bookings/:booking_id/approve-intent',
  authenticationMiddleware,
  roleMiddleware(['ADMIN']),
  validatorMiddleware(approveBookingIntentSchema, 1),
  approveBookingIntentHandler,
  internalErrorsMiddleware,
);

router.post(
  '/bookings/:booking_id/reject',
  authenticationMiddleware,
  roleMiddleware(['ADMIN']),
  validatorMiddleware(rejectBookingIntentSchema, 1),
  rejectBookingIntentHandler,
  internalErrorsMiddleware,
);

router.post(
  '/bookings/:booking_id/cancel',
  authenticationMiddleware,
  roleMiddleware(['ADMIN', 'SERVANT', 'STUDENT']),
  validatorMiddleware(cancelBookingIntentSchema, 1),
  cancelBookingIntentHandler,
  internalErrorsMiddleware,
);

router.post(
  '/bookings/new-intent',
  authenticationMiddleware,
  roleMiddleware(['ADMIN', 'SERVANT', 'STUDENT']),
  validatorMiddleware(createBookingIntentSchema, 1),
  createBookingIntentHandler,
  internalErrorsMiddleware,
);

router.delete(
  '/bookings/:booking_id/del',
  authenticationMiddleware,
  roleMiddleware(['ADMIN']),
  validatorMiddleware(excludeBookingSchema, 1),
  excludeBookingHandler,
  internalErrorsMiddleware,
);

router.get(
  '/rooms/:room_id/bookings',
  authenticationMiddleware,
  roleMiddleware(['ADMIN', 'SERVANT', 'STUDENT']),
  extraFieldsMiddleware(['filters', 'pagination']),
  validatorMiddleware(getRoomBookingsSchema, 1),
  paginationMiddleware,
  getRoomBookingsHandler,
  internalErrorsMiddleware,
);

router.get(
  '/bookings/users/:user_id',
  authenticationMiddleware,
  roleMiddleware(['ADMIN', 'SERVANT', 'STUDENT']),
  validatorMiddleware(listBookingsSchema, 1),
  findBookingsByUserIdHandler,
  internalErrorsMiddleware,
);

router.get(
  '/bookings',
  authenticationMiddleware,
  roleMiddleware(['ADMIN']),
  extraFieldsMiddleware(['filters', 'pagination']),
  validatorMiddleware(getBookingsSchema, 1),
  paginationMiddleware,
  getBookingsHandler,
  internalErrorsMiddleware,
);

export default router;
