import * as _ from 'lodash';
import esClient from '../helpers/elasticsearch.helper';
import IDiscussion from './discussion.interface';
import filterHelper from '../helpers/userhierarchy.helper';

export default class DiscussionService {
  public static index = 'discussions_test';

  public static async getDiscussionsNamesList(user: any) {
    const users: object[] = (await filterHelper.getMembersByUser(
      user.uniqueId
    )) as object[];

    const should = DiscussionService.shouldQuery(users);
    const body: any = {
      _source: ['_id', 'title'],
      query: {
        bool: {
          should: should,
        },
      },
    };

    return DiscussionService.client.search<IDiscussion>({
      index: DiscussionService.index,
      body,
    });
  }

  private static client = esClient.getClient();

  /**
   * returns the should query.
   *
   * @param filter gets an array of user objects.
   */
  private static shouldQuery(users: object[]) {
    const should: any[] = [];
    users.map((user: any) => {
      should.push({
        multi_match: {
          query: user.name,
        },
      });
    });
    return should;
  }
}
