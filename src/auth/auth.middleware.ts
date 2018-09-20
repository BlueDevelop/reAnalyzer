import {authenticate} from './passport';
import { Request, Response, NextFunction } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {

    // Check if user is authenticated.
    if (req.user) {
        return next();
    }
    return authenticate(req, res, next);
};