import { Router } from 'express';
import {
  listAvailabilityHoursHandler,
  removeHoursHandler,
} from '../controllers/hours.controller';
import { authenticationMiddleware } from '../middlewares/authentication.middleware';
import { internalErrorsMiddleware } from '../middlewares/errors.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validatorMiddleware } from '../middlewares/validators.middleware';
import {
  listAvailabilityHoursSchema,
  removeHoursSchema,
} from '../validators/hours/hours.schemas';

export const router = Router();

router.get(
  '/hours/availability',
  authenticationMiddleware,
  roleMiddleware(['ADMIN', 'SERVANT', 'STUDENT']),
  validatorMiddleware(listAvailabilityHoursSchema, 1),
  listAvailabilityHoursHandler,
  internalErrorsMiddleware,
);

router.delete(
  '/hours/del',
  authenticationMiddleware,
  roleMiddleware(['ADMIN']),
  validatorMiddleware(removeHoursSchema, 1),
  removeHoursHandler,
  internalErrorsMiddleware,
);

export default router;
