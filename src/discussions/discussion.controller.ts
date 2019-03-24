import { Request, Response } from 'express';

import DiscussionService from './discussion.service';
import infoLogger from '../loggers/info.logger';
import verboseLogger from '../loggers/verbose.logger';
import errorLogger from '../loggers/error.logger';
import filterHelper from '../helpers/userhierarchy.helper';
import _ from 'lodash';

export default class DiscussionController {
  /**
   * @returns a list of (discussionID,discussionName) representing discussions of users under the user's hierarchie
   *
   * @param {Request} req
   * @param {Response} res
   */
  public static async getDiscussionsNamesList(req: Request, res: Response) {
    let ret;
    if (req.user) {
      ret = await DiscussionService.getDiscussionsNamesList(req.user);
    } else {
      errorLogger.info(
        `getDiscussionsNamesList - req.user not exists - status 400 returned.`
      );
      return res.sendStatus(400);
    }
    // console.log(ret.body.hits.hits);
    let titleAndIndexFromRet = _.map(ret.body.hits.hits, doc => {
      return { key: doc._id, value: doc._source.title };
    });
    return res.json(titleAndIndexFromRet);
  }
}
