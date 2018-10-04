import {authenticate} from './passport';
import { Request, Response, NextFunction } from 'express';
import verboseLogger from '../loggers/verbose.logger';

export default (req: Request, res: Response, next: NextFunction) => {

    // Check if user is authenticated.
    if (req.user) {
        return next();
    }
    verboseLogger.verbose(`${req.ip} was sent for authentication`);
    return authenticate(req, res, next);
};