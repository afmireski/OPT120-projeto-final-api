import { Router } from 'express';
import {
  approveBookingIntentHandler,
  cancelBookingIntentHandler,
  rejectBookingIntentHandler,
  excludeBookingHandler,
} from '../controllers/bookings.controller';
import { authenticationMiddleware } from '../middlewares/authentication.middleware';
import { internalErrorsMiddleware } from '../middlewares/errors.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validatorMiddleware } from '../middlewares/validators.middleware';
import {
  approveBookingIntentSchema,
  cancelBookingIntentSchema,
  rejectBookingIntentSchema,
  excludeBookingSchema,
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

router.delete(
  '/bookings/:booking_id/del',
  authenticationMiddleware,
  roleMiddleware(['ADMIN']),
  validatorMiddleware(excludeBookingSchema, 1),
  excludeBookingHandler,
  internalErrorsMiddleware,
);

export default router;
