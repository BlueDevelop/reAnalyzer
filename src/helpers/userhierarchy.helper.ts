import getConfig from "../config";
const config = getConfig();
import * as _ from "lodash";
import axios from "axios";
import * as fs from "fs";
/**
 *
 *
 * @param {string} rootHierarchy return the ids\emails of all the users under this hierarchy
 */
async function getHierarchy(rootHierarchy?: string) {
  if (config.hierarchyServiceAddrGetMembers && rootHierarchy) {
    // if theres an api to get the hirerchy from and a root hirerchy to get then make then make the request to the api
    const getURL: string = config.hierarchyServiceAddrGetMembers(rootHierarchy);
    const response = await axios.get(getURL);
    const resData = response.data;

    const idList = _.map(resData, person => person.id);
    return idList;
  } else if (config.hierarchyServiceMockFile) {
    // use a static mock json file
    const data = JSON.parse(
      fs.readFileSync(config.hierarchyServiceMockFile, "utf8")
    );
    const idList = _.map(data, person => person.id);
    return idList;
  } else {
    // TODO:throw error or do nothing
    throw new Error("hierarchy not configured");
  }
}

const hierarchyService = { getHierarchy };

export default hierarchyService;
