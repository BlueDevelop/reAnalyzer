import taskService from './task.service';
import { Request, Response, NextFunction } from 'express';

export default class taskController {

    static async getFieldCountPerInterval(req: Request, res: Response, next: NextFunction) {
        if (!req.query.field || !req.query.from || !req.query.to) {
            return res.status(400);
        }
        if(req.query.field !== 'due' && req.query.field !== 'created') {
            return res.status(400);
        }
        if(isNaN(req.query.from) || isNaN(req.query.to)) {
            return res.status(400);
        }

        const response = await taskService.getFieldCountPerInterval(req.query.field,
                                                                    +req.query.from,
                                                                    +req.query.to,
                                                                    req.query.interval);

        res.json(response.hits.hits);
        return next(response.hits.hits);
    }

    static async getCountByStatus(req: Request, res: Response, next: NextFunction) {
        if (!req.query.from || !req.query.to) {
            return res.status(400);
        }
        if(isNaN(req.query.from) || isNaN(req.query.to)) {
            return res.status(400);
        }

        const response = await taskService.getCountByStatus(+req.query.from, +req.query.to);
        
        res.json(response.hits.hits);
        return next(response.hits.hits);
    }
}