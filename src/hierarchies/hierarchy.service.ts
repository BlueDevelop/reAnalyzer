import * as _ from 'lodash';
import hierarchyHelper from '../helpers/userhierarchy.helper';
import getConfig from '../config';
const config = getConfig();

export default class HierarchyService {
  public static async getHierarchiesNamesList(user: any) {
    const hierarchies: string[] = await hierarchyHelper.getDirectSubHierarchiesFromUser(
      user.uniqueId
    );
    const keyValuesFromHierarchies = _.map(hierarchies, groupID => {
      return {
        key: groupID,
        value: hierarchyHelper.getGroupNameByID(groupID),
      };
    });
    if (!config.hierarchyServiceAddrGetDirectSubHierarchiesFromUser)
      return keyValuesFromHierarchies;
    else return hierarchies;
  }
  public static async getPersonsUnderPerson(user: any) {
    const persons = await hierarchyHelper.getMembersByUser(user.uniqueId);
    return persons;
  }
}
