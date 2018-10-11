import taskService from './task.service';
import { Request, Response, NextFunction } from 'express';

export default class taskController {

    /**
     * validates queries and fetch the count of tasks per interval as given by a given field in given time range.
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} next 
     */
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

        res.json(response.aggregations['1']['buckets']);
        return next(response.aggregations['1']['buckets']);
    }

    /**
     * validates queries and fetch the count of tasks per status in a given time range.
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} next 
     */
    static async getCountByStatus(req: Request, res: Response, next: NextFunction) {
        if (!req.query.from || !req.query.to) {
            return res.status(400);
        }
        if(isNaN(req.query.from) || isNaN(req.query.to)) {
            return res.status(400);
        }

        const response = await taskService.getCountByStatus(+req.query.from, +req.query.to);
        
        res.json(response.aggregations['1']['buckets']);
        return next(response.aggregations['1']['buckets']);
    }
}