import { Request, Response } from 'express';

import predictionService from './prediction.service';
import infoLogger from '../loggers/info.logger';
import verboseLogger from '../loggers/verbose.logger';
import errorLogger from '../loggers/error.logger';
import filterHelper from '../helpers/userhierarchy.helper';
import _ from 'lodash';
import axios from 'axios';
import moment from 'moment';

const striptags = require('striptags');
const Entities = require('html-entities').AllHtmlEntities; // remove html entities like &nbsp
const entities = new Entities();
const decodeEntities = entities.decode;

export default class PredictionController {
  public static async generateAlakazamArray(res: any) {
    return 0;
  }

  /**
   * validates queries and fetch the count of tasks per interval as given by a given field in given time range.
   *
   * @param {Request} req
   * @param {Response} res
   */
  public static async predictFieldCountPerInterval(
    req: Request,
    res: Response
  ) {
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

      const filter: object[] = req.query.users;
      const officeMembers: object[] = req.query.officeMembers;
      verboseLogger.verbose(
        `getFieldCountPerInterval filter for user ${
          req.user.uniqueId
        } is ${filter}.`
      );
      const response = await predictionService.getFieldCountPerInterval(
        req.query.field,
        filter,
        req.query.officeCreated,
        req.query.officeAssign,
        officeMembers
      );
      let alakazamArray: any = PredictionController.generateAlakazamArray(
        response
      );
      //TO DO GET ARRAY OF THE FORM {ds:"date",y:"number"}

      const prediction = await predictionService.alakazam(alakazamArray);
      return res.json({
        field: req.query.field,
        prediction: prediction,
      });
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
  public static async predictCountByStatus(req: Request, res: Response) {
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

      const filter: object[] = req.query.users;
      const officeMembers: object[] = req.query.officeMembers;

      verboseLogger.verbose(
        `getCountByStatus filter for user ${req.user.uniqueId} is ${filter}.`
      );

      const response = await predictionService.predictCountByStatus(
        +req.query.from,
        +req.query.to,
        filter,
        req.query.officeCreated,
        req.query.officeAssign,
        officeMembers
      );

      verboseLogger.verbose(
        `getCountByStatus function returned ${
          response.body.aggregations['1'].buckets
        }.`
      );
      return res.json(response.body.aggregations['1'].buckets);
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
  public static async predictTagCloud(req: Request, res: Response) {
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
      //   PredictionController.cut
      // )) as object[];
      const filter: object[] = req.query.users;
      const officeMembers: object[] = req.query.officeMembers;

      verboseLogger.verbose(
        `getTagCloud filter for user ${req.user.uniqueId} is ${filter}.`
      );

      const response = await predictionService.predictTagCloud(
        +req.query.from,
        +req.query.to,
        filter,
        req.query.officeCreated,
        req.query.officeAssign,
        size,
        officeMembers
      );

      verboseLogger.verbose(
        `getTagCloud function returned ${
          response.body.aggregations['1'].buckets
        }.`
      );

      const resp: any = _.filter(
        response.body.aggregations['1'].buckets,
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
  public static async predictLeaderboard(req: Request, res: Response) {
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

      const filter: object[] = req.query.users;
      const officeMembers: object[] = req.query.officeMembers;

      verboseLogger.verbose(
        `getLeaderboard filter for user ${req.user.uniqueId} is ${filter}.`
      );

      const doneTasksCount = await predictionService.predictLeaderboard(
        +req.query.from,
        +req.query.to,
        filter,
        req.query.officeCreated,
        req.query.officeAssign,
        size,
        officeMembers
      );

      //get the top users with most done tasks
      const topUsers = _.map(
        doneTasksCount.body.aggregations['1'].buckets,
        obj => {
          return { id: obj.key };
        }
      );

      // get total tasks count for the top users
      const totalTasksCount = await predictionService.getTotalTasksCount(
        +req.query.from,
        +req.query.to,
        topUsers,
        req.query.officeCreated,
        req.query.officeAssign,
        size,
        officeMembers
      );

      const response = _.map(
        doneTasksCount.body.aggregations['1'].buckets,
        bucket => {
          const index = _.findIndex(
            totalTasksCount.body.aggregations['1'].buckets,
            (o: any) => {
              return o['key'].includes(bucket['key']);
            }
          );
          return {
            key: totalTasksCount.body.aggregations['1'].buckets[index]['key'],
            done: bucket['doc_count'],
            total:
              totalTasksCount.body.aggregations['1'].buckets[index][
                'doc_count'
              ],
          };
        }
      );

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

  public static predictRatiosByTasks(doneTasks: any[]) {
    const ratios: number[] = doneTasks.map((task: any) => {
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

      //! icu update model change created => -> date

      // Initiating value for the first assign date.
      let minAssignDate = new Date(sourceTask.assignUpdates[0].date).getTime();

      // Initiating value for the last "done" status date.
      let maxStatusDate = new Date(sourceTask.statusUpdates[0].date).getTime();

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
        const currDate = new Date(update.date).getTime();
        if (minAssignDate > currDate) {
          minAssignDate = currDate;
        }
      }

      // Go through all the status updates and finding the last(The date when the task really ended,
      // will always be a done status, otherwise it wont get it from elasticsearch).
      for (const update of sourceTask.statusUpdates) {
        const currDate = new Date(update.date).getTime();
        if (maxStatusDate < currDate) {
          maxStatusDate = currDate;
        }
      }

      // Calculate ratio - ((done-start) / (due-start))*100 - for precentage.
      const ratio =
        Math.abs(maxStatusDate - minAssignDate) / Math.abs(due - minAssignDate);
      task._source.ratio = ratio;
      return ratio;
    });
    return ratios;
  }

  /**
   * validates queries and fetch the task finish ratio in a given time range.
   *
   * @param {Request} req
   * @param {Response} res
   */
  public static async predictEndTimeRatio(req: Request, res: Response) {
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
      //   PredictionController.cut
      // )) as object[];
      const filter: object[] = req.query.users;
      const officeMembers: object[] = req.query.officeMembers;

      verboseLogger.verbose(
        `getEndTimeRatio filter for user ${req.user.uniqueId} is ${filter}.`
      );

      // Get all the tasks with status done from elasticsearch.
      let doneTasks = await predictionService.predictByField(
        'done',
        +req.query.from,
        +req.query.to,
        filter,
        req.query.officeCreated,
        req.query.officeAssign,
        'status',
        officeMembers
      );
      doneTasks = doneTasks.body.hits.hits;

      verboseLogger.verbose(
        `getByField service function returned ${doneTasks}.`
      );

      const ratios: number[] = PredictionController.predictRatiosByTasks(
        doneTasks
      );
      const under100interval = 0.25;
      const under100buckets = ['0%-25%', '25%-50%', '50%-75%', '75%-100%'];
      const above100interval = 3;
      const above100buckets = ['100%-400%', '400%-700%', '700%-1000%'];

      let groupedRatios: {
        // intervals: number[];
        ratios: any;
      } = {
        // intervals: [under100interval, above100interval],
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
          return '>1000%';
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

  public static clearTitle(title: string) {
    // let firstIndex: number = title.indexOf('>');
    // while (firstIndex != title.length - 1) {
    //   title = title.substring(firstIndex + 1, title.length);
    //   firstIndex = title.indexOf('>');
    // }

    // let lastIndex: number = title.lastIndexOf('<');
    // while (lastIndex != -1) {
    //   title = title.substring(0, lastIndex);
    //   lastIndex = title.lastIndexOf('<');
    // }
    return decodeEntities(striptags(title));
  }

  public static buildTasksList(tasks: any[]) {
    const fullNameGenerator = (name?: string, lastname?: string) =>
      `${name ? name : ''} ${lastname ? lastname : ''}`;
    const tasksList = tasks.map(task => {
      let due: string | undefined = undefined;
      if (task.due) {
        due = task.due as string;
      }

      const ret = {
        title: task.title ? PredictionController.clearTitle(task.title) : '',
        creator: task.creator
          ? fullNameGenerator(task.creator.name, task.creator.lastname)
          : '',
        assign: {
          id: task.assign ? task.assign.id : '',
          name: task.assign
            ? fullNameGenerator(task.assign.name, task.assign.lastname)
            : '',
        },
        due: due ? due : '',
        status: task.status ? task.status : '',
        watchers: task.watchers
          ? task.watchers.map((watcher: any) => {
              return {
                name: fullNameGenerator(watcher.name, watcher.lastname),
                id: watcher.id ? watcher.id : '',
              };
            })
          : [],
        description: task.description
          ? decodeEntities(striptags(task.description))
          : '',
      };
      return ret;
    });
    return tasksList;
  }

  public static async getTasksByFilter(req: Request, res: Response) {
    const users: object[] = req.query.users;
    const officeMembers: object[] = req.query.officeMembers;
    const filters = [
      'assign.id',
      'status',
      'name',
      'tag',
      'ratioMin',
      'ratioMax',
    ];
    let filter: any = {};
    for (let key in req.query) {
      if (filters.indexOf(key) > -1) {
        filter[key] = req.query[key];
      }
    }

    verboseLogger.verbose(
      `getTasksByFilter filter for user ${req.user.uniqueId} is ${filter}.`
    );
    let tasks: any;
    if ('ratioMin' in filter) {
      tasks = await predictionService.predictByField(
        'done',
        +req.query.from,
        +req.query.to,
        users,
        req.query.officeCreated,
        req.query.officeAssign,
        'status',
        officeMembers
      );
    } else {
      tasks = await predictionService.predictTasksByFilter(
        +req.query.from,
        +req.query.to,
        users,
        req.query.officeCreated,
        req.query.officeAssign,
        filter,
        officeMembers
      );
    }

    tasks = tasks.body.hits.hits;
    if ('ratioMin' in filter && 'ratioMax' in filter) {
      const ratioMin = +filter['ratioMin'];
      const ratioMax = +filter['ratioMax'];
      PredictionController.predictRatiosByTasks(tasks);
      tasks = _.filter(tasks, task => {
        if (ratioMax == -1) {
          return task._source.ratio >= ratioMin;
        } else {
          return (
            task._source.ratio >= ratioMin && task._source.ratio < ratioMax
          );
        }
      });
    }
    tasks = _.map(tasks, (task: any) => {
      return task['_source'];
    });
    tasks = PredictionController.buildTasksList(tasks);
    res.json(tasks);
  }

  /**
   *
   * @param req
   * @param res
   * @description gets the tasks statuses for each person
   */
  public static async predictStatusCountOfPersons(req: Request, res: Response) {
    const { persons } = req.query;
    //TODO: add intersection of persons and people under my hierarchy
    const responsesPromises: any = _.map(persons, async person => {
      const response = await predictionService.predictCountByStatus(
        +req.query.from,
        +req.query.to,
        [person],
        req.query.officeCreated,
        req.query.officeAssign
      );
      return response.body.aggregations['1'].buckets;
    });
    const responses: any = Promise.all(responsesPromises);

    res.json(responses);
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
