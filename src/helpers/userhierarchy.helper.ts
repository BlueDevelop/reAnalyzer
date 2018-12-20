/*
Terminology Notes:
*hierarchy\group will be used interchangeably
*user\member will be used interchangeably
*/

import getConfig from '../config';
const config = getConfig();
import * as _ from 'lodash';
import axios from 'axios';
import * as fs from 'fs';

const readAndParseJSON = (fileName: string) =>
  JSON.parse(fs.readFileSync(fileName, 'utf8'));
const memoizedReadAndParseJSON = _.memoize(readAndParseJSON); // after calling this function once it will cache the output and instantly return it

/**
 *
 *
 * @param {string} userID
 * @returns the hierarchy\directGroup of the given user
 */
async function userIDToHierarchyID(userID: string) {
  if (config.hierarchyServiceUseMock && config.hierarchyUserIDToHierarchyFile) {
    return memoizedReadAndParseJSON(config.hierarchyUserIDToHierarchyFile)[
      userID
    ];
  } else {
    return getHierarchyOfUser(userID);
  }
}

/**
 *
 *
 * @param {string} userID
 * @returns hierarchies\groups below the user`s hierarchy
 */
async function getDirectSubHierarchiesFromUser(userID: string) {
  const userHierarchy = await getHierarchyOfUser(userID);
  let subHierarchies: string[] = [];
  if (config.hierarchyFile) {
    subHierarchies = memoizedReadAndParseJSON(config.hierarchyFile)[
      userHierarchy
    ];
  }
  return subHierarchies;
}

/**
 *
 *
 * @param {string} groupID
 * @returns the group`s name if groupID is the group`s ID or the group`s name if groupID is the group`s name
 */
function getGroupNameByID(groupID: string) {
  let groupName = '';
  if (config.hierarchyGroupIdToGroupName) {
    groupName = memoizedReadAndParseJSON(config.hierarchyGroupIdToGroupName)[
      groupID
    ];
  }
  return groupName;
}

/**
 *
 *
 * @param {string} id
 * @returns the transformed id i.e. let id:=x@y then return x
 */
function defaultIDTransform(id: string) {
  return id.split('@')[0];
}

/**
 *
 *
 * @param {string} userID
 * @param {(id: string) => string} [transformID]
 * @returns members under the hierarchy of this user
 */
async function getMembersByUser(
  userID: string,
  transformID?: (id: string) => string
) {
  transformID = transformID || defaultIDTransform; // if no transform function is given, use the default transform function
  userID = transformID(userID);
  const userHierarchy = await userIDToHierarchyID(userID);
  // if (config.hierarchyServiceUseMock && config.hierarchyServiceMockFile) {
  //   // use mock
  //   return userHierarchy
  //     ? memoizedReadAndParseJSON(config.hierarchyServiceMockFile)[userHierarchy]
  //     : [];
  // }
  // use api
  const directMembers = await getDirectMembersOfHierarchy(userHierarchy);
  let indirectMembers: any[] = [];
  // if (config.hierarchyServiceGroupMembersFile) {
  //   indirectMembers = await getIndirectMembersOfHierarchy(userHierarchy);
  // }
  indirectMembers = await getIndirectMembersOfHierarchy(userHierarchy);

  console.log('user hierarchy getMembersByUser');
  console.log(indirectMembers);
  return _.union(directMembers, indirectMembers);
}

/**
 *
 *
 * @param {string} userID
 * @param {(id:string)=>string} [transformID]
 * @returns the hierarchy of the given user
 */
async function getHierarchyOfUser(
  userID: string,
  transformID?: (id: string) => string
) {
  transformID = transformID || defaultIDTransform; // if no transform function is given, use the default transform function
  userID = transformID(userID);

  if (config.hierarchyServiceUseMock && config.hierarchyUserIDToHierarchyFile) {
    const userToHierarchMaper = memoizedReadAndParseJSON(
      config.hierarchyUserIDToHierarchyFile
    );
    const hierarchy: string = userToHierarchMaper[userID];
    return hierarchy;
  } else if (config.hierarchyServiceAddrGetUser) {
    const genURL = config.hierarchyServiceAddrGetUser;
    const getURL = genURL(userID);
    const userResponse = await axios.get(getURL); // retrieves the user
    const user = userResponse.data;
    return user.directGroup;
  } else {
    // TODO:throw error or do nothing
    throw new Error('hierarchy not configured');
  }
}
/**
 *
 * @param {string} hierarchyID
 * @returns members under the given hierarchy
 */
async function getDirectMembersOfHierarchy(hierarchyID: string) {
  if (config.hierarchyServiceAddrGetMembers) {
    // if theres an api to get the hirerchy from and a root hirerchy to get then make then make the request to the api
    const genURL = config.hierarchyServiceAddrGetMembers; // renamed for shorter name when called
    const getURL: string = genURL(hierarchyID); // generate the url to call to get the immediate members of the group(rootHierarchy)
    const response = await axios.get(getURL); // get direct members\submembers
    const resData = response.data;
    // return only ids
    const idList = _.map(resData, person => person.id);
    return idList;
  } else if (
    config.hierarchyServiceUseMock &&
    config.hierarchyServiceMockFile
  ) {
    const service = memoizedReadAndParseJSON(config.hierarchyServiceMockFile);
    return service[hierarchyID];
  }
}

/**
 *
 *
 * @param {string} HierarchyID
 * @returns members indirectly under the given hierarchy by looking at the config file
 */
async function getIndirectMembersOfHierarchy(hierarchyID: string) {
  console.log('in getIndirectMembersOfHierarchy');
  console.log(
    `config.hierarchyServiceUseMock:${config.hierarchyServiceUseMock}`
  );
  console.log(
    `config.hierarchyServiceMockFile:${config.hierarchyServiceMockFile}`
  );
  if (config.hierarchyServiceUseMock && config.hierarchyServiceMockFile) {
    const members = memoizedReadAndParseJSON(config.hierarchyServiceMockFile)[
      hierarchyID
    ];
    if (config.hierarchyFile) {
      const subHierarchies = memoizedReadAndParseJSON(config.hierarchyFile)[
        hierarchyID
      ];
      const aoaData: any = await Promise.all(
        _.map(subHierarchies, getIndirectMembersOfHierarchy)
      );
      return _.union(...aoaData, members);
    }
  } else if (config.hierarchyServiceAddrGetMembers) {
    // return from api by hierarchy file
    const genURL = config.hierarchyServiceAddrGetMembers;
    if (config.hierarchyFile) {
      const subHierarchies = memoizedReadAndParseJSON(config.hierarchyFile)[
        hierarchyID
      ];
      const aoaResponse = await Promise.all(
        _.map(subHierarchies, sub => axios.get(genURL(sub)))
      );
      const aoaData = _.map(aoaResponse, resp => resp.data);
      return _.union(...aoaData);
    }
  }
  return [];
}

const hierarchyService = {
  getDirectMembersOfHierarchy,
  getIndirectMembersOfHierarchy,
  getMembersByUser,
  getHierarchyOfUser,
  userIDToHierarchyID,
  getDirectSubHierarchiesFromUser,
  getGroupNameByID,
};

export default hierarchyService;
