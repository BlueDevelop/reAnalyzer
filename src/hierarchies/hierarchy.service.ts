import * as _ from 'lodash';
import hierarchyHelper from '../helpers/userhierarchy.helper';

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
    return keyValuesFromHierarchies;
  }
}
