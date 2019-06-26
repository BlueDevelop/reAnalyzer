import * as express from 'express';

import predictionController from './prediction.controller';
import authenticate from '../auth/auth.middleware';
import filters from '../middlewares/filters.middleware';
const router = express.Router();

/**
 * GET /task/fieldCountPerInterval?field=due&from=123&to=124&interval=1d.
 * the interval field is optional and defaults to 1d.
 * @returns count of field per interval.
 */
router.get(
  '/predictFieldCountPerInterval',
  authenticate,
  filters.parseFiltersFromQueryString,
  filters.getMembersOfHierarchy,
  predictionController.predictFieldCountPerInterval
);

export default router;
