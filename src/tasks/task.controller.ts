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

      const filter: object[] = req.query.officeMembers
        ? req.query.officeMembers
        : req.query.users;
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
        req.query.officeCreated,
        req.query.officeAssign,
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

      const filter: object[] = req.query.officeMembers
        ? req.query.officeMembers
        : req.query.users;
      console.log('query!');
      console.log(req.query);
      console.log('USERS!');
      console.log(filter);

      verboseLogger.verbose(
        `getCountByStatus filter for user ${req.user.uniqueId} is ${filter}.`
      );

      const response = await taskService.getCountByStatus(
        +req.query.from,
        +req.query.to,
        filter,
        req.query.officeCreated,
        req.query.officeAssign
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

      // const filter: object[] = (await filterHelper.getMembersByUser(
      //   req.user.uniqueId,
      //   TaskController.cut
      // )) as object[];
      const filter: object[] = req.query.officeMembers
        ? req.query.officeMembers
        : req.query.users;

      verboseLogger.verbose(
        `getTagCloud filter for user ${req.user.uniqueId} is ${filter}.`
      );

      const response = await taskService.getTagCloud(
        +req.query.from,
        +req.query.to,
        filter,
        req.query.officeCreated,
        req.query.officeAssign,
        size
      );

      verboseLogger.verbose(
        `getTagCloud function returned ${response.aggregations['1'].buckets}.`
      );

      const resp: any = _.filter(
        response.aggregations['1'].buckets,
        obj => obj.key != 'Agenda'
      );
      return res.json(resp);
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
      console.log('===SIZE===');
      console.log(size);

      // const filter: object[] = (await filterHelper.getMembersByUser(
      //   req.user.uniqueId,
      //   TaskController.cut
      // )) as object[];
      const filter: object[] = req.query.officeMembers
        ? req.query.officeMembers
        : req.query.users;

      console.log('===FILTER===');
      console.log(filter);
      verboseLogger.verbose(
        `getLeaderboard filter for user ${req.user.uniqueId} is ${filter}.`
      );

      const doneTasksCount = await taskService.getLeaderboard(
        +req.query.from,
        +req.query.to,
        filter,
        req.query.officeCreated,
        req.query.officeAssign,
        size
      );
      console.log('===DONE TASKS COUNT===');
      console.log(doneTasksCount.aggregations['1'].buckets);

      //get the top users with most done tasks
      const topUsers = _.map(doneTasksCount.aggregations['1'].buckets, obj => {
        return { id: obj.key };
      });
      console.log('===TOP USERS===');
      console.log(topUsers);

      // get total tasks count for the top users
      const totalTasksCount = await taskService.getTotalTasksCount(
        +req.query.from,
        +req.query.to,
        topUsers,
        req.query.officeCreated,
        req.query.officeAssign,
        size
      );

      console.log('===Total TASKS COUNT===');
      console.log(totalTasksCount.aggregations['1'].buckets);
      const response = _.map(
        doneTasksCount.aggregations['1'].buckets,
        bucket => {
          const index = _.findIndex(
            totalTasksCount.aggregations['1'].buckets,
            (o: any) => {
              return o['key'].includes(bucket['key']);
            }
          );
          return {
            key: totalTasksCount.aggregations['1'].buckets[index]['key'],
            done: bucket['doc_count'],
            total:
              totalTasksCount.aggregations['1'].buckets[index]['doc_count'],
          };
        }
      );

      console.log('===response===');
      console.log(response);

      verboseLogger.verbose(`getLeaderboard function returned ${response}.`);

      return res.json(response);
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

      // const filter: object[] = (await filterHelper.getMembersByUser(
      //   req.user.uniqueId,
      //   TaskController.cut
      // )) as object[];
      const filter: object[] = req.query.officeMembers
        ? req.query.officeMembers
        : req.query.users;

      verboseLogger.verbose(
        `getEndTimeRatio filter for user ${req.user.uniqueId} is ${filter}.`
      );

      // Get all the tasks with status done from elasticsearch.
      const doneTasks = (await taskService.getByField(
        'done',
        +req.query.from,
        +req.query.to,
        filter,
        req.query.officeCreated,
        req.query.officeAssign,
        'status'
      )).hits.hits;

      verboseLogger.verbose(
        `getByField service function returned ${doneTasks}.`
      );

      // Calculate ratio for each task.
      const ratios: number[] = doneTasks.map(task => {
        // Extract data from the task.
        const sourceTask: any = task._source;
        if (
          !sourceTask.due ||
          _.isNaN(sourceTask.due) ||
          !sourceTask.assignUpdates ||
          !sourceTask.statusUpdates ||
          sourceTask.assignUpdates.length == 0 ||
          sourceTask.statusUpdates.length == 0
        ) {
          return 0;
        }

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

        if (
          !minAssignDate ||
          _.isNaN(minAssignDate) ||
          !maxStatusDate ||
          _.isNaN(maxStatusDate)
        ) {
          return 0;
        }

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
          Math.abs(maxStatusDate - minAssignDate) /
          Math.abs(due - minAssignDate);

        return ratio;
      });

      const under100interval = 0.25;
      const under100buckets = ['0%-25%', '25%-50%', '50%-75%', '75%-100%'];
      const above100interval = 3;
      const above100buckets = ['100%-400%', '400%-700%', '700%-1000%'];

      let groupedRatios: { intervals: number[]; ratios: any } = {
        intervals: [under100interval, above100interval],
        ratios: [],
      };
      let ratiosCounts = _.groupBy(ratios, ratio => {
        if (ratio == 0) {
          return '-';
        } else if (ratio > 0 && ratio < 1) {
          return under100buckets[Math.floor(ratio / under100interval)];
        } else if (ratio >= 1 && ratio < 10) {
          return above100buckets[Math.floor((ratio - 1) / above100interval)];
        } else {
          return '<1000%';
        }
      });
      for (let key in ratiosCounts) {
        if (key != '-') {
          groupedRatios.ratios.push({
            name: key,
            value: ratiosCounts[key].length,
          });
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
