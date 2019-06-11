import * as express from 'express';

import predictionController from './prediction.controller';
import authenticate from '../auth/auth.middleware';
import filters from '../middlewares/filters.middleware';
const router = express.Router();

/**
 * GET /task/countByStatus?from=123&to=124.
 * returns count of tasks per status.
 */
router.get(
  '/predictCountByStatus',
  authenticate,
  filters.parseFiltersFromQueryString,
  filters.getMembersOfHierarchy,
  predictionController.predictCountByStatus
);

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

router.get(
  '/predictStatusCountOfPersons',
  authenticate,
  filters.parseFiltersFromQueryString,
  filters.getMembersOfHierarchy,
  predictionController.predictStatusCountOfPersons
);

/**
 * GET /task/tagCloud?from=123&to=124&size=40.
 * the size field is optional and defaults to 40.
 * @returns count of each unique tag according to size given.
 */
router.get(
  '/tagCloud',
  authenticate,
  filters.parseFiltersFromQueryString,
  filters.getMembersOfHierarchy,
  predictionController.predictTagCloud
);

/**
 * GET /task/leaderboard?from=123&to=124&size=10.
 * the size field is optional and defaults to 10.
 * @returns users according to size given ordered by the number of completed tasks.
 */
router.get(
  '/leaderboard',
  authenticate,
  filters.parseFiltersFromQueryString,
  filters.getMembersOfHierarchy,
  predictionController.predictLeaderboard
);

/**
 * GET /task/endTimeRatio?from=123&to=124.
 * @returns ratio of end task time.
 */
router.get(
  '/endTimeRatio',
  authenticate,
  filters.parseFiltersFromQueryString,
  filters.getMembersOfHierarchy,
  predictionController.predictEndTimeRatio
);

router.get(
  '/tasksByFilter',
  authenticate,
  filters.parseFiltersFromQueryString,
  filters.getMembersOfHierarchy,
  predictionController.getTasksByFilter
);

export default router;
