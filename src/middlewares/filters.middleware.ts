import { Request, Response, NextFunction } from 'express';
import filterHelper from '../helpers/userhierarchy.helper';
import * as _ from 'lodash';

/**
 *
 *
 * @description takes the query string parameters and parses them into arrays, then saves them in req.query
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
function parseFiltersFromQueryString(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const sep: string = ',';
  const paramsToParse = ['units', 'discussions', 'projects'];
  // creates a new object based of req.query where the values of the keys in paramsToParse are parsed.
  req.query = _.mapValues(
    req.query,
    (value, key) =>
      _.includes(paramsToParse, key) ? _.split(value, sep) : value
  );
  next();
}

/**
 * returns formatted email as userId.
 *
 * @param str gets email to be formatted as userId.
 */
function cut(str: string) {
  return str.split('@')[0];
}

async function getMembersOfHierarchy(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const usersUnderUsersHierarchy: object[] = (await filterHelper.getMembersByUser(
    req.user.uniqueId,
    cut
  )) as object[];
  const units = req.query.units;
  const selectedUnitsPromises = _.flatMap(
    units,
    async unit => await filterHelper.getIndirectMembersOfHierarchy(unit)
  );
  const selectedUnits: any = _.defaultTo(
    _.flatMap(await Promise.all(selectedUnitsPromises), _.identity),
    []
  ); // returns the first/head element promise.all returns array of arrays
  console.log('user');
  console.log(req.user.uniqueId);
  console.log('usersUnderUsersHierarchy');
  console.log(usersUnderUsersHierarchy);
  console.log('selectedUnits');
  console.log(selectedUnits);
  const filter: object[] = units
    ? _.intersection(usersUnderUsersHierarchy, selectedUnits)
    : usersUnderUsersHierarchy;
  console.log('filter');
  console.log(filter);

  req.query.users = filter;
  next();
}

export default {
  parseFiltersFromQueryString,
  getMembersOfHierarchy,
};
