import * as express from 'express';

import discussionController from './discussion.controller';
import authenticate from '../auth/auth.middleware';

const router = express.Router();

router.get(
  '/discussionsNamesList',
  authenticate,
  discussionController.getDiscussionsNamesList
);

export default router;
