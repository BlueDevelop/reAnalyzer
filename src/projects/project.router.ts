import * as express from 'express';

import projectController from './project.controller';
import authenticate from '../auth/auth.middleware';
import filters from '../middlewares/filters.middleware';

const router = express.Router();

router.get(
  '/projectsNamesList',
  authenticate,
  filters.getMembersOfHierarchy,
  projectController.getProjectsNamesList
);

export default router;
