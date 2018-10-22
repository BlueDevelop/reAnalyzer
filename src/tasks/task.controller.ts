import { Request, Response } from 'express';

import taskService from './task.service';
import infoLogger from '../loggers/info.logger';
import errorLogger from '../loggers/error.logger';
import filterHelper from '../helpers/userhierarchy.helper';

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
        return res.sendStatus(400);
      }
      if (req.query.field !== 'due' && req.query.field !== 'created') {
        return res.sendStatus(400);
      }
      if (isNaN(req.query.from) || isNaN(req.query.to)) {
        return res.sendStatus(400);
      }

      const filter: string[] = (await filterHelper.getMembersByUser(
        req.user
      )) as string[];

      const response = await taskService.getFieldCountPerInterval(
        req.query.field,
        +req.query.from,
        +req.query.to,
        filter,
        req.query.interval
      );

      return res.json(response.aggregations['1'].buckets);
    } catch (err) {
      errorLogger.error('%j', {
        message: err.message,
        stack: err.stack,
        name: err.name,
      });
      return res.sendStatus(500);
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
        return res.sendStatus(400);
      }
      if (isNaN(req.query.from) || isNaN(req.query.to)) {
        return res.sendStatus(400);
      }

      const filter: string[] = (await filterHelper.getHierarchy(
        req.user
      )) as string[];

      const response = await taskService.getCountByStatus(
        +req.query.from,
        +req.query.to,
        filter
      );

      return res.json(response.aggregations['1'].buckets);
    } catch (err) {
      errorLogger.error('%j', {
        message: err.message,
        stack: err.stack,
        name: err.name,
      });
      return res.sendStatus(500);
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
        return res.sendStatus(400);
      }
      if (
        isNaN(req.query.from) ||
        isNaN(req.query.to) ||
        (req.query.size && isNaN(req.query.size))
      ) {
        return res.sendStatus(400);
      }

      const size = req.query.size ? +req.query.size : undefined;

      const filter: string[] = (await filterHelper.getHierarchy(
        req.user
      )) as string[];

      const response = await taskService.getTagCloud(
        +req.query.from,
        +req.query.to,
        filter,
        size
      );

      return res.json(response.aggregations['1'].buckets);
    } catch (err) {
      errorLogger.error('%j', {
        message: err.message,
        stack: err.stack,
        name: err.name,
      });
      return res.sendStatus(500);
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
        return res.sendStatus(400);
      }
      if (
        isNaN(req.query.from) ||
        isNaN(req.query.to) ||
        (req.query.size && isNaN(req.query.size))
      ) {
        return res.sendStatus(400);
      }

      const size = req.query.size ? +req.query.size : undefined;

      const filter: string[] = (await filterHelper.getHierarchy(
        req.user
      )) as string[];

      const response = await taskService.getLeaderboard(
        +req.query.from,
        +req.query.to,
        filter,
        size
      );

      return res.json(response.aggregations['1'].buckets);
    } catch (err) {
      errorLogger.error('%j', {
        message: err.message,
        stack: err.stack,
        name: err.name,
      });
      return res.sendStatus(500);
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
      // Validate input.
      if (!req.query.from || !req.query.to) {
        return res.sendStatus(400);
      }
      if (isNaN(req.query.from) || isNaN(req.query.to)) {
        return res.sendStatus(400);
      }

      const filter: string[] = (await filterHelper.getHierarchy(
        req.user
      )) as string[];

      // Get all the tasks with status done from elasticsearch.
      const doneTasks = (await taskService.getByField(
        'done',
        +req.query.from,
        +req.query.to,
        filter,
        'status'
      )).hits.hits;

      // Calculate ratio for each task.
      const ratios = doneTasks.map(task => {
        // Extract data from the task.
        const sourceTask: any = task._source;

        // Due date of the task.
        const due = new Date(sourceTask.due).getTime();

        // Initiating value for the first assign date.
        let minAssignDate = new Date(
          sourceTask.assignUpdates[0].created
        ).getTime();

        // Initiating value for the last "done" status date.
        let maxStatusDate = new Date(
          sourceTask.statusUpdates[0].created
        ).getTime();

        // Go through all the assign updates and finding the first
        // (The first assign date is the start date of the task).
        for (const update of sourceTask.assignUpdates) {
          const currDate = new Date(update.created).getTime();
          if (minAssignDate > currDate) {
            minAssignDate = currDate;
          }
        }

        // Go through all the status updates and finding the last(The date when the task really ended,
        // will always be a done status, otherwise it wont get it from elasticsearch).
        for (const update of sourceTask.statusUpdates) {
          const currDate = new Date(update.created).getTime();
          if (maxStatusDate < currDate) {
            maxStatusDate = currDate;
          }
        }

        // Calculate ratio - ((done-start) / (due-start))*100 - for precentage.
        const ratio =
          (Math.abs(maxStatusDate - minAssignDate) /
            Math.abs(due - minAssignDate)) *
          100;

        return ratio;
      });

      // Calculate avarage difference to use as interval.
      let sum = 0;
      for (let i = 0; i < ratios.length; ++i) {
        sum += i === 0 ? ratios[i] : ratios[i] - ratios[i - 1];
      }

      const interval = sum / ratios.length;

      // Initializing return obj.
      const groupedRatios: {
        interval: number;
        ratios: number[];
      } = { interval, ratios: [] };

      // Count the number of tasks in each group.
      for (const ratio of ratios) {
        const index = Math.floor(ratio / interval);
        if (groupedRatios.ratios[index]) {
          groupedRatios.ratios[index]++;
        } else {
          groupedRatios.ratios[index] = 1;
        }
      }

      // If there are groups without values(tasks) init them to zero.
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
}
