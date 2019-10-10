import { Request, Response } from 'express';

import taskService from './task.service';
import infoLogger from '../loggers/info.logger';
import verboseLogger from '../loggers/verbose.logger';
import errorLogger from '../loggers/error.logger';
import filterHelper from '../helpers/userhierarchy.helper';
import hierarchyService from '../helpers/userhierarchy.helper';
import _ from 'lodash';
import moment from 'moment';

const striptags = require('striptags');
const Entities = require('html-entities').AllHtmlEntities; // remove html entities like &nbsp
const entities = new Entities();
const decodeEntities = entities.decode;

export default class TaskController {
  public static getDoneDates(doneTasks: any[]) {
    const doneDates: Date[] = doneTasks.map((task: any) => {
      const sourceTask: any = task._source;
      if (!sourceTask.statusUpdates || sourceTask.statusUpdates.length == 0) {
        return new Date(0);
      }
      // Initiating value for the last "done" status date.
      let maxStatusDate = new Date(sourceTask.statusUpdates[0].date).getTime();

      if (!maxStatusDate || _.isNaN(maxStatusDate)) {
        return new Date(0);
      }

      // Go through all the status updates and finding the last(The date when the task really ended,
      // will always be a done status, otherwise it wont get it from elasticsearch).
      for (let update of sourceTask.statusUpdates) {
        let currDate = new Date(update.date).getTime();
        if (maxStatusDate < currDate) {
          maxStatusDate = currDate;
        }
      }

      return new Date(maxStatusDate);
    });
    return doneDates;
  }
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
      if (
        req.query.field !== 'due' &&
        req.query.field !== 'created' &&
        req.query.field !== 'closed'
      ) {
        errorLogger.info(
          `getFieldCountPerInterval - field is not due or created or closed - status 400 returned.`
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

      if (req.query.field == 'closed') {
        let doneTasks = await taskService.getByField(
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

        let doneDates: Date[] = TaskController.getDoneDates(doneTasks);

        for (let i = 0; i < doneTasks.length; i++) {
          doneTasks[i] = doneTasks[i]._source;
          doneTasks[i].doneDate = doneDates[i];
        }
        doneTasks = doneTasks.filter(
          (task: any) => task.doneDate.getTime() != new Date(0).getTime()
        );

        doneTasks = _.groupBy(doneTasks, (task: any) =>
          task.doneDate.getTime()
        );

        let data = [];
        for (let key in doneTasks) {
          let doc_count = doneTasks[key].length;
          data.push({
            key: key,
            key_as_string: new Date(+key).toString(),
            doc_count: doc_count,
          });
        }

        return res.json({
          field: req.query.field,
          data: data,
        });
      } else {
        const response = await taskService.getFieldCountPerInterval(
          req.query.field,
          +req.query.from,
          +req.query.to,
          filter,
          req.query.officeCreated,
          req.query.officeAssign,
          req.query.interval,
          officeMembers
        );

        verboseLogger.verbose(
          `getFieldCountPerInterval function returned ${
            response.body.aggregations['1'].buckets
          }.`
        );

        return res.json({
          field: req.query.field,
          data: response.body.aggregations['1'].buckets,
        });
      }
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

      const filter: object[] = req.query.users;
      const officeMembers: object[] = req.query.officeMembers;

      verboseLogger.verbose(
        `getCountByStatus filter for user ${req.user.uniqueId} is ${filter}.`
      );

      const response = await taskService.getCountByStatus(
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
   * validates queries and fetch the count of tasks open  in a given time range.
   *
   * @param {Request} req
   * @param {Response} res
   */
  public static async getOpenTasks(req: Request, res: Response) {
    //     GET tasks_test/_search
    // {
    //   "query": {
    //     "bool": {
    //   "must_not" : {  "term" : { "status" : "done" }}
    //   }},
    //   "aggs": {
    //     "delay": {
    //       "date_range": {
    //         "field": "due",
    //         "ranges": [
    //           { "to": "now" , "key": "delay"},
    //          { "from": "now", "key": "open" }
    //         ]
    //       }
    //     }
    //   }
    // }
    try {
      if (!req.query.from || !req.query.to) {
        errorLogger.info(
          `getOpenTasks - from or to queries are missing - status 400 returned.`
        );
        return res.sendStatus(400);
      }
      if (isNaN(req.query.from) || isNaN(req.query.to)) {
        errorLogger.info(
          `getOpenTasks - from or to are not a number - status 400 returned.`
        );
        return res.sendStatus(400);
      }

      const filter: object[] = req.query.users;
      const officeMembers: object[] = req.query.officeMembers;

      verboseLogger.verbose(
        `getOpenTasks filter for user ${req.user.uniqueId} is ${filter}.`
      );

      const hierarchyName = await hierarchyService.getHierarchyOfUser(
        req.user.uniqueId
      );
      const response = await taskService.getOpenTasks(
        +req.query.from,
        +req.query.to,
        filter,
        req.query.officeCreated,
        req.query.officeAssign,
        officeMembers,
        hierarchyName
      );

      verboseLogger.verbose(
        `getOpenTasks function returned ${
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
      const filter: object[] = req.query.users;
      const officeMembers: object[] = req.query.officeMembers;

      verboseLogger.verbose(
        `getTagCloud filter for user ${req.user.uniqueId} is ${filter}.`
      );

      const response = await taskService.getTagCloud(
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
      let resp2 = resp.map((item: any) => {
        let key = item['key'];
        let doc_count = item['doc_count'];
        let percentage =
          (item['2']['3']['buckets'][0]['doc_count'] / doc_count) * 100;
        return { key: key, doc_count: doc_count, percentage: percentage };
      });
      return res.json(resp2);
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

      const filter: object[] = req.query.users;
      const officeMembers: object[] = req.query.officeMembers;

      verboseLogger.verbose(
        `getLeaderboard filter for user ${req.user.uniqueId} is ${filter}.`
      );

      const doneTasksCount = await taskService.getLeaderboard(
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
      const totalTasksCount = await taskService.getTotalTasksCount(
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

  public static getRatiosByTasks(doneTasks: any[]) {
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
      const filter: object[] = req.query.users;
      const officeMembers: object[] = req.query.officeMembers;

      verboseLogger.verbose(
        `getEndTimeRatio filter for user ${req.user.uniqueId} is ${filter}.`
      );

      // Get all the tasks with status done from elasticsearch.
      let doneTasks = await taskService.getByField(
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

      const ratios: number[] = TaskController.getRatiosByTasks(doneTasks);
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
        title: task.title ? TaskController.clearTitle(task.title) : '',
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

  public static async getMyTasks(req: Request, res: Response) {
    if (!req.query.from || !req.query.to) {
      errorLogger.info(
        `getOpenTasks - from or to queries are missing - status 400 returned.`
      );
      return res.sendStatus(400);
    }
    if (!req.query.open) {
      errorLogger.info(`getOpenTasks -open is missing - status 400 returned.`);
      return res.sendStatus(400);
    }
    if (isNaN(req.query.from) || isNaN(req.query.to)) {
      errorLogger.info(
        `getOpenTasks - from or to are not a number - status 400 returned.`
      );
      return res.sendStatus(400);
    }
    req.query.open = req.query.open == 'false' ? false : true;
    const filter: object[] = req.query.users;
    const officeMembers: object[] = req.query.officeMembers;
    const open = req.query.open;

    verboseLogger.verbose(
      `getOpenTasks filter for user ${req.user.uniqueId} is ${filter}.`
    );

    const hierarchyName = await hierarchyService.getHierarchyOfUser(
      req.user.uniqueId
    );
    let tasks = await taskService.getOpenTasks(
      +req.query.from,
      +req.query.to,
      filter,
      req.query.officeCreated,
      req.query.officeAssign,
      officeMembers,
      hierarchyName
    );
    tasks = tasks.body.hits.hits;

    tasks = _.map(tasks, (task: any) => {
      return task['_source'];
    });
    let newTasks = [];
    let now = new Date();
    for (let task of tasks) {
      if (task.due) {
        let due = new Date(task.due);
        if (open && due < now) {
          newTasks.push(task);
        } else if (!open && due > now) {
          newTasks.push(task);
        }
      }
    }
    newTasks = TaskController.buildTasksList(newTasks);
    res.json(newTasks);
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
      tasks = await taskService.getByField(
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
      tasks = await taskService.getTasksByFilter(
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
      TaskController.getRatiosByTasks(tasks);
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
    tasks = TaskController.buildTasksList(tasks);
    res.json(tasks);
  }

  /**
   *
   * @param req
   * @param res
   * @description gets the tasks statuses for each person
   */
  public static async statusCountOfPersons(req: Request, res: Response) {
    const { persons } = req.query;
    //TODO: add intersection of persons and people under my hierarchy
    const responsesPromises: any = _.map(persons, async person => {
      const response = await taskService.getCountByStatus(
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
