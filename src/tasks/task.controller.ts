import { Request, Response } from 'express';

import taskService from './task.service';
import infoLogger from '../loggers/info.logger';
import verboseLogger from '../loggers/verbose.logger';
import errorLogger from '../loggers/error.logger';
import filterHelper from '../helpers/userhierarchy.helper';
import _ from 'lodash';

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
        errorLogger.info(
          `getFieldCountPerInterval - field, from or to queries are missing - status 400 returned.`
        );
        return res.sendStatus(400);
      }
      if (req.query.field !== 'due' && req.query.field !== 'created') {
        errorLogger.info(
          `getFieldCountPerInterval - field is not due or created - status 400 returned.`
        );
        return res.sendStatus(400);
      }
      if (isNaN(req.query.from) || isNaN(req.query.to)) {
        errorLogger.info(
          `getFieldCountPerInterval - from or to are not a number - status 400 returned.`
        );
        return res.sendStatus(400);
      }

      verboseLogger.verbose(`getFieldCountPerInterval function was called.`);

      const filter: object[] = (await filterHelper.getMembersByUser(
        req.user.uniqueId,
        TaskController.cut
      )) as object[];

      verboseLogger.verbose(
        `getFieldCountPerInterval filter for user ${
          req.user.uniqueId
        } is ${filter}.`
      );

      const response = await taskService.getFieldCountPerInterval(
        req.query.field,
        +req.query.from,
        +req.query.to,
        filter,
        req.query.interval
      );

      verboseLogger.verbose(
        `getFieldCountPerInterval function returned ${
          response.aggregations['1'].buckets
        }.`
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
        errorLogger.info(
          `getCountByStatus - from or to queries are missing - status 400 returned.`
        );
        return res.sendStatus(400);
      }
      if (isNaN(req.query.from) || isNaN(req.query.to)) {
        errorLogger.info(
          `getCountByStatus - from or to are not a number - status 400 returned.`
        );
        return res.sendStatus(400);
      }

      const filter: object[] = (await filterHelper.getMembersByUser(
        req.user.uniqueId,
        TaskController.cut
      )) as object[];

      verboseLogger.verbose(
        `getCountByStatus filter for user ${req.user.uniqueId} is ${filter}.`
      );

      const response = await taskService.getCountByStatus(
        +req.query.from,
        +req.query.to,
        filter
      );

      verboseLogger.verbose(
        `getCountByStatus function returned ${
          response.aggregations['1'].buckets
        }.`
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
        errorLogger.info(
          `getTagCloud - from or to queries are missing - status 400 returned.`
        );
        return res.sendStatus(400);
      }
      if (
        isNaN(req.query.from) ||
        isNaN(req.query.to) ||
        (req.query.size && isNaN(req.query.size))
      ) {
        errorLogger.info(
          `getTagCloud - from, to or size are not a number - status 400 returned.`
        );
        return res.sendStatus(400);
      }

      const size = req.query.size ? +req.query.size : undefined;

      const filter: object[] = (await filterHelper.getMembersByUser(
        req.user.uniqueId,
        TaskController.cut
      )) as object[];

      verboseLogger.verbose(
        `getTagCloud filter for user ${req.user.uniqueId} is ${filter}.`
      );

      const response = await taskService.getTagCloud(
        +req.query.from,
        +req.query.to,
        filter,
        size
      );

      verboseLogger.verbose(
        `getTagCloud function returned ${response.aggregations['1'].buckets}.`
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
        errorLogger.info(
          `getLeaderboard - from or to queries are missing - status 400 returned.`
        );
        return res.sendStatus(400);
      }
      if (
        isNaN(req.query.from) ||
        isNaN(req.query.to) ||
        (req.query.size && isNaN(req.query.size))
      ) {
        errorLogger.info(
          `getLeaderboard - from, to or size are not a number - status 400 returned.`
        );
        return res.sendStatus(400);
      }

      const size = req.query.size ? +req.query.size : undefined;

      const filter: object[] = (await filterHelper.getMembersByUser(
        req.user.uniqueId,
        TaskController.cut
      )) as object[];

      verboseLogger.verbose(
        `getLeaderboard filter for user ${req.user.uniqueId} is ${filter}.`
      );

      const response = await taskService.getLeaderboard(
        +req.query.from,
        +req.query.to,
        filter,
        size
      );

      verboseLogger.verbose(
        `getLeaderboard function returned ${
          response.aggregations['1'].buckets
        }.`
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
        errorLogger.info(
          `getLeaderboard - from or to queries are missing - status 400 returned.`
        );
        return res.sendStatus(400);
      }
      if (isNaN(req.query.from) || isNaN(req.query.to)) {
        errorLogger.info(
          `getCountByStatus - from or to are not a number - status 400 returned.`
        );
        return res.sendStatus(400);
      }

      const filter: object[] = (await filterHelper.getMembersByUser(
        req.user.uniqueId,
        TaskController.cut
      )) as object[];

      verboseLogger.verbose(
        `getEndTimeRatio filter for user ${req.user.uniqueId} is ${filter}.`
      );

      // Get all the tasks with status done from elasticsearch.
      const doneTasks = (await taskService.getByField(
        'done',
        +req.query.from,
        +req.query.to,
        filter,
        'status'
      )).hits.hits;

      verboseLogger.verbose(
        `getByField service function returned ${doneTasks}.`
      );

      // Calculate ratio for each task.
      const ratios: number[] = doneTasks.map(task => {
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
      const max = _.max(ratios) || 0;
      const min = _.min(ratios) || 0;

      const epsilon = 1;
      const sortedRatios = ratios.sort();
      let pivot = sortedRatios[0];
      let count = 1;
      for (const ratio of sortedRatios) {
        if (ratio - pivot > epsilon) {
          count++;
          pivot = ratio;
        }
      }
      let interval = (max - min) / count;
      interval = Math.ceil(interval);

      // Initializing return obj.
      const groupedRatios: {
        interval: number;
        ratios: number[];
      } = { interval, ratios: [] };

      // Count the number of tasks in each group.
      for (const ratio of ratios) {
        const index =
          ratio % interval === 0
            ? Math.floor(ratio / interval) - 1
            : Math.floor(ratio / interval);
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

      verboseLogger.verbose(
        `getEndTimeRatio function returned ${groupedRatios}.`
      );

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

  /**
   * returns formatted email as userId.
   *
   * @param str gets email to be formatted as userId.
   */
  private static cut(str: string) {
    return str.split('@')[0];
  }
}
