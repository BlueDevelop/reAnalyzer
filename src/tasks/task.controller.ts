import taskService from './task.service';
import infoLogger from '../loggers/info.logger';
import errorLogger from '../loggers/error.logger';
import { Request, Response } from 'express';
import * as _ from 'lodash';

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

  /**
   * validates queries and fetch the task finish ratio in a given time range.
   *
   * @param {Request} req
   * @param {Response} res
   */
  public static async getEndTimeRatio(req: Request, res: Response) {
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

      const doneTasks = (await taskService.getByField(
        'done',
        +req.query.from,
        +req.query.to,
        'status'
      )).hits.hits;

      const ratios = doneTasks.map(task => {
        const sourceTask: any = task._source;
        const due = new Date(sourceTask.due).getTime();
        let minAssignDate = new Date(
          sourceTask.assignUpdates[0].created
        ).getTime();
        let maxStatusDate = new Date(
          sourceTask.statusUpdates[0].created
        ).getTime();

        for (const update of sourceTask.assignUpdates) {
          const currDate = new Date(update.created).getTime();
          if (minAssignDate > currDate) {
            minAssignDate = currDate;
          }
        }

        for (const update of sourceTask.statusUpdates) {
          const currDate = new Date(update.created).getTime();
          if (maxStatusDate < currDate) {
            maxStatusDate = currDate;
          }
        }

        const ratio =
          (Math.abs(maxStatusDate - minAssignDate) /
            Math.abs(due - minAssignDate)) *
          100;

        return ratio;
      });

      const interval = this.averageDiff(ratios);
      const groupedRatios: {
        interval: number;
        ratios: number[];
      } = { interval, ratios: [] };

      for (const ratio of ratios) {
        const index = Math.floor(ratio / interval);
        if (groupedRatios.ratios[index]) {
          groupedRatios.ratios[index]++;
        } else {
          groupedRatios.ratios[index] = 1;
        }
      }

      for (let i = 0; i < groupedRatios.ratios.length; ++i) {
        if (!groupedRatios.ratios[i]) {
          groupedRatios.ratios[i] = 0;
        }
      }

      return res.json(groupedRatios);
    } catch (err) {
      errorLogger.error('%j', {
        message: err.message,
        stack: err.stack,
        name: err.name,
      });
      return res.status(500);
    }
  }

  private static averageDiff(collection: number[]) {
    return (
      collection.reduce((sum: number = 0, value: number, i: number) => {
        return (
          sum + (i === 0 ? collection[i] : collection[i] - collection[i - 1])
        );
      }) / collection.length
    );
  }
}
