import * as express from 'express';

import taskController from './task.controller';
import authenticate from '../auth/auth.middleware';

const router = express.Router();

/**
 * GET /task/countByStatus?from=123&to=124.
 * returns count of tasks per status.
 */
router.get('/countByStatus', authenticate, taskController.getCountByStatus);

/**
 * GET /task/fieldCountPerInterval?field=due&from=123&to=124&interval=1d.
 * the interval field is optional and defaults to 1d.
 * @returns count of field per interval.
 */
router.get('/fieldCountPerInterval', authenticate, taskController.getFieldCountPerInterval);

export default router;