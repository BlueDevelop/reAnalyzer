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
 * GET /task/openTasks?from=123&to=124.
 * returns count of open tasks.
 */
router.get(
  '/openTasks',
  authenticate,
  filters.parseFiltersFromQueryString,
  filters.getMembersOfHierarchy,
  taskController.getOpenTasks
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

router.get(
  '/statusCountOfPersons',
  authenticate,
  filters.parseFiltersFromQueryString,
  filters.getMembersOfHierarchy,
  taskController.statusCountOfPersons
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
  taskController.getTagCloud
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
  taskController.getLeaderboard
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
  taskController.getEndTimeRatio
);

router.get(
  '/tasksByFilter',
  authenticate,
  filters.parseFiltersFromQueryString,
  filters.getMembersOfHierarchy,
  taskController.getTasksByFilter
);

router.get(
  '/getMyTasks',
  authenticate,
  filters.parseFiltersFromQueryString,
  filters.getMembersOfHierarchy,
  taskController.getMyTasks
);

export default router;
