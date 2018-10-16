import taskService from './task.service';
import infoLogger from '../loggers/info.logger';
import errorLogger from '../loggers/error.logger';
import { Request, Response } from 'express';

export default class TaskController {
  /**
   * validates queries and fetch the count of tasks per interval as given by a given field in given time range.
   *
   * @param {Request} req
   * @param {Response} res
   */
  public static async getFieldCountPerInterval(req: Request, res: Response) {
    try {
      if (!req.query.field || !req.query.from || !req.query.to) {
        return res.status(400);
      }
      if (req.query.field !== 'due' && req.query.field !== 'created') {
        return res.status(400);
      }
      if (isNaN(req.query.from) || isNaN(req.query.to)) {
        return res.status(400);
      }

      const response = await taskService.getFieldCountPerInterval(
        req.query.field,
        +req.query.from,
        +req.query.to,
        req.query.interval
      );

      return res.json(response.aggregations['1'].buckets);
    } catch (err) {
      errorLogger.error('%j', {
        message: err.message,
        stack: err.stack,
        name: err.name,
      });
      return res.status(500);
    }
  }

  /**
   * validates queries and fetch the count of tasks per status in a given time range.
   *
   * @param {Request} req
   * @param {Response} res
   */
  public static async getCountByStatus(req: Request, res: Response) {
    try {
      if (!req.query.from || !req.query.to) {
        return res.status(400);
      }
      if (isNaN(req.query.from) || isNaN(req.query.to)) {
        return res.status(400);
      }

      const response = await taskService.getCountByStatus(
        +req.query.from,
        +req.query.to
      );

      return res.json(response.aggregations['1'].buckets);
    } catch (err) {
      errorLogger.error('%j', {
        message: err.message,
        stack: err.stack,
        name: err.name,
      });
      return res.status(500);
    }
  }

  /**
   * validates queries and fetch the cloud tag data in a given time range.
   *
   * @param {Request} req
   * @param {Response} res
   */
  public static async getTagCloud(req: Request, res: Response) {
    try {
      if (!req.query.from || !req.query.to) {
        return res.status(400);
      }
      if (
        isNaN(req.query.from) ||
        isNaN(req.query.to) ||
        (req.query.size && isNaN(req.query.size))
      ) {
        return res.status(400);
      }

      const size = req.query.size ? +req.query.size : undefined;

      const response = await taskService.getTagCloud(
        +req.query.from,
        +req.query.to,
        size
      );

      return res.json(response.aggregations['1'].buckets);
    } catch (err) {
      errorLogger.error('%j', {
        message: err.message,
        stack: err.stack,
        name: err.name,
      });
      return res.status(500);
    }
  }

  /**
   * validates queries and fetch the leaderboard data in a given time range.
   *
   * @param {Request} req
   * @param {Response} res
   */
  public static async getLeaderboard(req: Request, res: Response) {
    try {
      if (!req.query.from || !req.query.to) {
        return res.status(400);
      }
      if (
        isNaN(req.query.from) ||
        isNaN(req.query.to) ||
        (req.query.size && isNaN(req.query.size))
      ) {
        return res.status(400);
      }

      const size = req.query.size ? +req.query.size : undefined;

      const response = await taskService.getLeaderboard(
        +req.query.from,
        +req.query.to,
        size
      );

      return res.json(response.aggregations['1'].buckets);
    } catch (err) {
      errorLogger.error('%j', {
        message: err.message,
        stack: err.stack,
        name: err.name,
      });
      return res.status(500);
    }
  }
}
