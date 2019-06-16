import * as express from 'express';

import discussionController from './discussion.controller';
import authenticate from '../auth/auth.middleware';
import filters from '../middlewares/filters.middleware';

const router = express.Router();

router.get(
  '/discussionsNamesList',
  authenticate,
  filters.getMembersOfHierarchy,
  discussionController.getDiscussionsNamesList
);

export default router;
