import { Router } from 'express';
import { approveBookingIntentHandler } from '../controllers/bookings.controller';
import { authenticationMiddleware } from '../middlewares/authentication.middleware';
import { internalErrorsMiddleware } from '../middlewares/errors.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validatorMiddleware } from '../middlewares/validators.middleware';
import { approveBookingIntentSchema } from '../validators/bookings/bookings.schemas';

export const router = Router();

router.post(
  '/bookings/:booking_id/approve-intent',
  authenticationMiddleware,
  roleMiddleware(['ADMIN']),
  validatorMiddleware(approveBookingIntentSchema, 1),
  approveBookingIntentHandler,
  internalErrorsMiddleware,
);

export default router;
