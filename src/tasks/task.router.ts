import * as express from 'express';

import taskController from './task.controller';
import authenticate from '../auth/auth.middleware';
import filters from '../middlewares/filters.middleware';
const router = express.Router();

/**
 * GET /task/countByStatus?from=123&to=124.
 * returns count of tasks per status.
 */
router.get(
  '/countByStatus',
  authenticate,
  filters.parseFiltersFromQueryString,
  filters.getMembersOfHierarchy,
  taskController.getCountByStatus
);

/**
 * GET /task/fieldCountPerInterval?field=due&from=123&to=124&interval=1d.
 * the interval field is optional and defaults to 1d.
 * @returns count of field per interval.
 */
router.get(
  '/fieldCountPerInterval',
  authenticate,
  filters.parseFiltersFromQueryString,
  filters.getMembersOfHierarchy,
  taskController.getFieldCountPerInterval
);

/**
 * GET /task/tagCloud?from=123&to=124&size=40.
 * the size field is optional and defaults to 40.
 * @returns count of each unique tag according to size given.
 */
router.get('/tagCloud', authenticate, taskController.getTagCloud);

/**
 * GET /task/leaderboard?from=123&to=124&size=10.
 * the size field is optional and defaults to 10.
 * @returns users according to size given ordered by the number of completed tasks.
 */
router.get('/leaderboard', authenticate, taskController.getLeaderboard);

/**
 * GET /task/endTimeRatio?from=123&to=124.
 * @returns ratio of end task time.
 */
router.get('/endTimeRatio', authenticate, taskController.getEndTimeRatio);

export default router;
