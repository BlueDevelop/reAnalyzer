import { Request, Response } from 'express';

import ProjectService from './project.service';
import infoLogger from '../loggers/info.logger';
import verboseLogger from '../loggers/verbose.logger';
import errorLogger from '../loggers/error.logger';
import filterHelper from '../helpers/userhierarchy.helper';
import _ from 'lodash';

export default class ProjectController {
  /**
   * @returns a list of (projectID,projectName) representing projects of users under the user's hierarchie
   *
   * @param {Request} req
   * @param {Response} res
   */
  public static async getProjectsNamesList(req: Request, res: Response) {
    let ret;
    if (req.user) {
      ret = await ProjectService.getProjectsNamesList(req.user);
    } else {
      errorLogger.info(
        `getProjectsNamesList - req.user not exists - status 400 returned.`
      );
      return res.sendStatus(400);
    }
    let titleAndIndexFromRet = _.map(ret.body.hits.hits, doc => {
      return { key: doc._id, value: doc._source.title };
    });
    return res.json(titleAndIndexFromRet);
  }
}
