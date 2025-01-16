import { Router } from 'express';
import { authenticationMiddleware } from '../middlewares/authentication.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validatorMiddleware } from '../middlewares/validators.middleware';
import { listAvailabilityHoursHandler } from '../controllers/hours.controller';
import { internalErrorsMiddleware } from '../middlewares/errors.middleware';
import { listAvailabilityHoursSchema } from '../validators/hours/hours.schemas';

export const router = Router();

router.get(
  '/hours/availability',
  authenticationMiddleware,
  roleMiddleware(['ADMIN', 'SERVANT', 'STUDENT']),
  validatorMiddleware(listAvailabilityHoursSchema, 1),
  listAvailabilityHoursHandler,
  internalErrorsMiddleware,
);

export default router;
