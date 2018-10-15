import taskService from "./task.service";
import infoLogger from "../loggers/info.logger";
import errorLogger from "../loggers/error.logger";
import { Request, Response, NextFunction } from "express";

export default class taskController {
  /**
   * validates queries and fetch the count of tasks per interval as given by a given field in given time range.
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  static async getFieldCountPerInterval(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.query.field || !req.query.from || !req.query.to) {
        res.status(400);
        return next();
      }
      if (req.query.field !== "due" && req.query.field !== "created") {
        res.status(400);
        return next();
      }
      if (isNaN(req.query.from) || isNaN(req.query.to)) {
        res.status(400);
        return next();
      }

      const response = await taskService.getFieldCountPerInterval(
        req.query.field,
        +req.query.from,
        +req.query.to,
        req.query.interval
      );

      res.json(response.aggregations["1"]["buckets"]);
      return next(response.aggregations["1"]["buckets"]);
    } catch (err) {
      errorLogger.error("%j", {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
      res.status(500);
      next(err);
    }
  }

  /**
   * validates queries and fetch the count of tasks per status in a given time range.
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  static async getCountByStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.query.from || !req.query.to) {
        res.status(400);
        return next();
      }
      if (isNaN(req.query.from) || isNaN(req.query.to)) {
        res.status(400);
        return next();
      }

      const response = await taskService.getCountByStatus(
        +req.query.from,
        +req.query.to
      );

      res.json(response.aggregations["1"]["buckets"]);
      return next(response.aggregations["1"]["buckets"]);
    } catch (err) {
      errorLogger.error("%j", {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
      res.status(500);
      next(err);
    }
  }

  /**
   * validates queries and fetch the cloud tag data in a given time range.
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  static async getTagCloud(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.query.from || !req.query.to) {
        res.status(400);
        return next();
      }
      if (
        isNaN(req.query.from) ||
        isNaN(req.query.to) ||
        (req.query.size && isNaN(req.query.size))
      ) {
        res.status(400);
        return next();
      }

      const size = req.query.size ? +req.query.size : undefined;

      const response = await taskService.getTagCloud(
        +req.query.from,
        +req.query.to,
        size
      );

      res.json(response.aggregations["1"]["buckets"]);
      return next(response.aggregations["1"]["buckets"]);
    } catch (err) {
      errorLogger.error("%j", {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
      res.status(500);
      next(err);
    }


    /**
     * validates queries and fetch the leaderboard data in a given time range.
     * 
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     */
    static async getLeaderboard(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.query.from || !req.query.to) {
                res.status(400);
                return next();
            }
            if (isNaN(req.query.from) || isNaN(req.query.to) || (req.query.size && isNaN(req.query.size))) {
                res.status(400);
                return next();
            }

            const size = req.query.size ? +req.query.size : undefined;

            const response = await taskService.getLeaderboard(+req.query.from, +req.query.to, size);

            res.json(response.aggregations['1']['buckets']);
            return next(response.aggregations['1']['buckets']);
        }
        catch (err) {
            errorLogger.error('%j', {
                message: err.message,
                stack: err.stack,
                name: err.name
            });
            res.status(500);
            next(err);
        }
    }
}

