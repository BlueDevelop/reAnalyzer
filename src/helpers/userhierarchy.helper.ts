import getConfig from '../config';
const config = getConfig();

import axios from 'axios';
import * as fs from 'fs';
/**
 *
 *
 * @param {string} rootHierarchy return the ids\emails of all the users under this hierarchy
 */
async function getHierarchy(rootHierarchy?: string) {
  let data;
  if (config.hierarchyServiceAddrGetMembers && rootHierarchy) {
    // if theres an api to get the hirerchy from and a root hirerchy to get then make then make the request to the api
    const getURL: string = config.hierarchyServiceAddrGetMembers(rootHierarchy);
    const response = await axios.get(getURL);
    data = response.data;
  } else if (config.hierarchyServiceMockFile) {
    // use a static mock json file
    data = JSON.parse(fs.readFileSync(config.hierarchyServiceMockFile, 'utf8'));
  } else {
    // TODO:throw error or do nothing
    throw new Error('hierarchy not configured');
  }
  return data.map((person: any) => {
    return person.id;
  });
}

const hierarchyService = { getHierarchy };

export default hierarchyService;
