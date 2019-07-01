import { Request, Response } from 'express';

import predictionService from './prediction.service';
import infoLogger from '../loggers/info.logger';
import verboseLogger from '../loggers/verbose.logger';
import errorLogger from '../loggers/error.logger';
import filterHelper from '../helpers/userhierarchy.helper';
import _ from 'lodash';
import axios from 'axios';
import moment from 'moment';

export default class PredictionController {
  //TO DO GET ARRAY OF THE FORM {ds:"date",y:"number"}

  public static generateAlakazamArray(histogram: any) {
    return _.map(histogram, item => {
      return {
        ds: new Date(item.key).toISOString().slice(0, 10),
        y: item.doc_count,
      };
    });
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
      if (!req.query.field) {
        errorLogger.info(
          `predictFieldCountPerInterval - field is missing - status 400 returned.`
        );
        return res.sendStatus(400);
      }
      if (req.query.field !== 'due' && req.query.field !== 'created') {
        errorLogger.info(
          `predictFieldCountPerInterval - field is not due or created - status 400 returned.`
        );
        return res.sendStatus(400);
      }
      verboseLogger.verbose(
        `predictFieldCountPerInterval function was called.`
      );
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

      const histogram = response.body.aggregations['1'].buckets;

      let alakazamArray: any = PredictionController.generateAlakazamArray(
        histogram
      );
      const prediction = await predictionService.alakazam(alakazamArray);
      const forcast = prediction.data.forcast;
      console.log(forcast);
      return res.json({
        field: req.query.field,
        forcast: forcast,
        existingData: _.map(histogram, item => {
          return {
            ds: item.key,
            y: item.doc_count,
          };
        }),
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
}
