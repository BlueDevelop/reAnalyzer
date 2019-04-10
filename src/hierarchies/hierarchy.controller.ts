import { Request, Response } from 'express';

import HierarchyService from './hierarchy.service';
import infoLogger from '../loggers/info.logger';
import verboseLogger from '../loggers/verbose.logger';
import errorLogger from '../loggers/error.logger';
import filterHelper from '../helpers/userhierarchy.helper';
import _ from 'lodash';

export default class HierarchyController {
  /**
   * @returns a list of (hierarchyID,hierarchyName) representing hierarchies of users under the user's hierarchy
   *
   * @param {Request} req
   * @param {Response} res
   */
  public static async getHierarchiesNamesList(req: Request, res: Response) {
    let ret;
    if (req.user) {
      ret = await HierarchyService.getHierarchiesNamesList(req.user);
    } else {
      errorLogger.info(
        `getHierarchiesNamesList - req.user not exists - status 400 returned.`
      );
      return res.sendStatus(400);
    }
    // let keyAndValueFromRet = _.map(ret, doc => {
    //   return { key: doc._id, value: doc._source.title };
    // });
    return res.json(ret);
  }

  public static getUsersUnderHierarchy(req: Request, res: Response) {
    res.send(['blablabla', 'hahaha', 'lalala']);
  }

  public static async getPersonsUnderPerson(req: Request, res: Response) {
    let ret;
    if (req.user) {
      ret = await HierarchyService.getPersonsUnderPerson(req.user);
    } else {
      return res.sendStatus(400);
    }
    // let keyAndValueFromRet = _.map(ret, doc => {
    //   return { key: doc._id, value: doc._source.title };
    // });
    return res.json(ret);
  }
}
