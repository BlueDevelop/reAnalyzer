import * as express from 'express';
import User from './user.model';
import IUser from './user.interface';
import userController from './user.controller';
import authenticate from '../auth/auth.middleware';

const router = express.Router();

/**
 * POST /user
 * Creates a new user in the database.
 */
router.post('/', async (req, res, next) => {
    try {
      const user = await userController.create(new User({
        uniqueId: req.body.uniqueId,
        password: req.body.password,
        name: req.body.name
      }));
  
      return res.json(user);
    } catch (err) {
      res.status(400);
      next(err);
    }
  });

export default router;
