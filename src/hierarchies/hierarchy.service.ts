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
  public static async getPersonsUnderPerson(user: any) {
    const persons = await hierarchyHelper.getMembersByUser(user.uniqueId);
    const persons2 = await hierarchyHelper.getMembersByUser('1');
    console.log(persons);
    console.log(persons2);
    return persons;
  }
}
