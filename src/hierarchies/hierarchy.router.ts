import * as express from 'express';

import hierarchyController from './hierarchy.controller';
import authenticate from '../auth/auth.middleware';

const router = express.Router();

/**
 * GET /task/countByStatus?from=123&to=124.
 * returns count of tasks per status.
 */
router.get(
  '/hierarchiesNamesList',
  authenticate,
  hierarchyController.getHierarchiesNamesList
);
router.get(
  '/usersUnderHierarchy',
  authenticate,
  hierarchyController.getUsersUnderHierarchy
);

router.get(
  '/getPersonsUnderPerson',
  authenticate,
  hierarchyController.getPersonsUnderPerson
);

export default router;
