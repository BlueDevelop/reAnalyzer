import * as express from 'express';

import projectController from './project.controller';
import authenticate from '../auth/auth.middleware';

const router = express.Router();

router.get(
  '/projectsNamesList',
  authenticate,
  projectController.getProjectsNamesList
);

export default router;
