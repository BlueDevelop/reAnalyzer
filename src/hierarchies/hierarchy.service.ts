import * as _ from 'lodash';
import filterHelper from '../helpers/userhierarchy.helper';

export default class HierarchyService {
  public static async getHierarchiesNamesList(user: any) {
    const hierarchies: string[] = await filterHelper.getDirectSubHierarchiesFromUser(
      user.uniqueId
    );
    return hierarchies;
  }
}
