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
  const paramsToParse = ['units', 'discussions', 'projects', 'persons'];
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

  const clientSendsEmptyStringAsTheUnitsParameter = _.size(_.head(units)) > 1;
  const intersectIfUnitsExistsAndNotEmpty =
    units && units.length > 0 && clientSendsEmptyStringAsTheUnitsParameter;

    
   req.query.officeFilteredUsers = _.filter(
     usersUnderUsersHierarchy,
   (person:any)=>_.includes(req.user.officeMembers,person.id)
     )
    
  const filter: object[] = intersectIfUnitsExistsAndNotEmpty
    ? _.intersectionBy(
        usersUnderUsersHierarchy,
        selectedUnits,
        (person: any) => person.id
      )
    : req.query.officeFilteredUsers;

  req.query.users = filter;

  req.query.officeCreated = req.query.officeCreated == 'true';
  req.query.officeAssign = req.query.officeAssign == 'true';

  if (req.query.officeCreated == true || req.query.officeAssign == true) {
    req.query.officeMembers = req.user.officeMembers;
  } else {
    req.query.officeMembers = [];
  }
    
  if(!req.query.officeCreated && !req.query.officeAssign)
    req.query.users = [req.user.uniqueId]
  next();
}

export default {
  parseFiltersFromQueryString,
  getMembersOfHierarchy,
};
