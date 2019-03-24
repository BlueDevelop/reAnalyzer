import * as express from 'express';

import infoLogger from '../loggers/info.logger';
import errorLogger from '../loggers/error.logger';
import User from './user.model';
import Iuser from './user.interface';
import userController from './user.controller';
import authenticate from '../auth/auth.middleware';
import UserService from './user.service';

const router = express.Router();

/**
 * POST /user
 * Creates a new user in the database.
 */
router.post('/', async (req, res, next) => {
  try {
    const user = await userController.create(
      new User({
        uniqueId: req.body.uniqueId,
        password: req.body.password,
        name: req.body.name,
      })
    );

    infoLogger.info(`User ${user.uniqueId} - ${user.name} was created.`);

    return res.json(user);
  } catch (err) {
    errorLogger.error('%j', {
      message: err.message,
      stack: err.stack,
      name: err.name,
    });
    return res.sendStatus(400);
  }
});

router.put('/', async (req, res, next) => {
  try {
    const user = req.body;
    //console.log(user);
    await UserService.update(user);
    return res.json(user);
  } catch (err) {
    errorLogger.error('%j', {
      message: err.message,
      stack: err.stack,
      name: err.name,
    });
    return res.sendStatus(400);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const user = await UserService.find(req.user._id);
    //console.log('the user is');
    //console.log(user);
    return res.json(user);
  } catch (err) {
    errorLogger.error('%j', {
      message: err.message,
      stack: err.stack,
      name: err.name,
    });
    return res.sendStatus(400);
  }
});

export default router;
