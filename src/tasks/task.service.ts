import esClient from '../helpers/elasticsearch.helper';
import Itask from './task.interface';

export default class TaskService {
  public static index = 'tasks_test';
  /**
   * Returns the requested result from elasticsearch.
   * @param {string} value The value to search.
   * @param {number} from Date to search from in epoch_millis.
   * @param {number} to Date to search to in epoch_millis.
   * @param {object[]} filter filter by users.
   * @param {string?} field The field to search by, defaults to '_id'.
   */
  public static getByField(
    value: string,
    from: number,
    to: number,
    filter: object[] = [],
    field?: string
  ) {
    const searchField = field || '_id';

    const should = TaskService.prefixQuery(filter) || [];

    const body: any = {
      query: {
        bool: {
          must: [
            {
              range: {
                created: {
                  gte: from,
                  lte: to,
                  format: 'epoch_millis',
                },
              },
            },
            {
              match: {},
            },
          ],
          filter: [],
          should,
          //minimum_should_match: 1,
          must_not: [],
        },
      },
    };

    body.query.bool.must[1].match[searchField] = value;
    return TaskService.client.search<Itask>({
      index: TaskService.index,
      body,
    });
  }

  /**
   * Returns the count of tasks per interval as given by a given field in given time range.
   * @param {string} field The field to search by, must be a Date field.
   * @param {number} from Date to search from in epoch_millis.
   * @param {number} to Date to search to in epoch_millis.
   * @param {object[]} filter filter by users.
   * @param {string?} interval The interval as DurationString, defaults to '1d'.
   */
  public static getFieldCountPerInterval(
    field: string,
    from: number,
    to: number,
    filter: object[] = [],
    interval?: string
  ) {
    const should = TaskService.prefixQuery(filter);

    return TaskService.client.search<Itask>({
      index: TaskService.index,
      body: {
        aggs: {
          1: {
            date_histogram: {
              field,
              interval: interval || '1d',
              time_zone: 'Asia/Jerusalem',
              min_doc_count: 1,
            },
          },
        },
        size: 0,
        _source: {
          excludes: [],
        },
        stored_fields: ['*'],
        script_fields: {},
        docvalue_fields: [
          'assignUpdates.created',
          'assignUpdates.updated',
          'comments.created',
          'comments.updated',
          'created',
          'due',
          'statusUpdates.created',
          'statusUpdates.updated',
          'updated',
        ],
        query: {
          bool: {
            must: [
              {
                range: {
                  created: {
                    gte: from,
                    lte: to,
                    format: 'epoch_millis',
                  },
                },
              },
            ],
            filter: [
              {
                match_all: {},
              },
            ],
            should,
            //minimum_should_match: 1,
            must_not: [],
          },
        },
      },
    });
  }

  /**
   * Returns the count of tasks per status in a given time range.
   *
   * @param {number} from Date to search from in epoch_millis.
   * @param {number} to Date to search to in epoch_millis.
   * @param {object[]} filter filter by users.
   */
  public static getCountByStatus(
    from: number,
    to: number,
    filter: object[] = []
  ) {
    const should = TaskService.prefixQuery(filter);

    return TaskService.client.search({
      index: TaskService.index,
      body: {
        aggs: {
          1: {
            terms: {
              field: 'status.keyword',
              size: 10,
              order: {
                _count: 'desc',
              },
            },
          },
        },
        size: 0,
        _source: {
          excludes: [],
        },
        stored_fields: ['*'],
        script_fields: {},
        docvalue_fields: [
          'assignUpdates.created',
          'assignUpdates.updated',
          'comments.created',
          'comments.updated',
          'created',
          'due',
          'statusUpdates.created',
          'statusUpdates.updated',
          'updated',
        ],
        query: {
          bool: {
            must: [
              {
                range: {
                  created: {
                    gte: from,
                    lte: to,
                    format: 'epoch_millis',
                  },
                },
              },
            ],
            filter: [
              {
                match_all: {},
              },
            ],
            should,
            //minimum_should_match: 1,
            must_not: [],
          },
        },
      },
    });
  }

  /**
   * Returns the count of unique tags in a given time range.
   *
   * @param {number} from Date to search from in epoch_millis.
   * @param {number} to Date to search to in epoch_millis.
   * @param {object[]} filter filter by users.
   * @param {number?} size The number of tags, defaults to 40.
   */
  public static getTagCloud(
    from: number,
    to: number,
    filter: object[] = [],
    size?: number
  ) {
    const should = TaskService.prefixQuery(filter);

    return TaskService.client.search({
      index: TaskService.index,
      body: {
        aggs: {
          1: {
            terms: {
              field: 'tags.keyword',
              size: size || 40,
              order: {
                _count: 'desc',
              },
            },
          },
        },
        size: 0,
        _source: {
          excludes: [],
        },
        stored_fields: ['*'],
        script_fields: {},
        docvalue_fields: [
          'assignUpdates.created',
          'assignUpdates.updated',
          'comments.created',
          'comments.updated',
          'created',
          'due',
          'statusUpdates.created',
          'statusUpdates.updated',
          'updated',
        ],
        query: {
          bool: {
            must: [
              {
                match_all: {},
              },
              {
                range: {
                  created: {
                    gte: from,
                    lte: to,
                    format: 'epoch_millis',
                  },
                },
              },
            ],
            filter: [],
            should,
            //minimum_should_match: 1,
            must_not: [],
          },
        },
      },
    });
  }

  /**
   * Returns the first {size} users ordered by completed tasks in a given time range.
   *
   * @param {number} from Date to search from in epoch_millis.
   * @param {number} to Date to search to in epoch_millis.
   * @param {object[]} filter filter by users.
   * @param {number?} size The number of tags, defaults to 10.
   */
  public static getLeaderboard(
    from: number,
    to: number,
    filter: object[] = [],
    size?: number
  ) {
    const should = TaskService.prefixQuery(filter);

    return TaskService.client.search({
      index: TaskService.index,
      body: {
        query: {
          bool: {
            must: [
              {
                terms: {
                  'status.keyword': ['done'],
                },
              },
              {
                range: {
                  created: {
                    gte: from,
                    lte: to,
                    format: 'epoch_millis',
                  },
                },
              },
            ],
            filter: [],
            should,
            //minimum_should_match: 1,
            must_not: [],
          },
        },
        aggregations: {
          1: {
            terms: {
              //field: 'assign.id.keyword',
              // the :? operator returns the right side expression if its not null otherwise it returns the left side expression
              script: "doc['assign.name.keyword'].value + '\t\t\t\t' + doc['assign.id.keyword'].value?:doc['assign.name.keyword'].value + ' ' + doc['assign.lastname.keyword'].value + '\t\t\t\t' + doc['assign.id.keyword'].value ",
              size: size || 10,
              order: {
                _count: 'desc',
              },
            },
          },
        },
      },
    });
  }

  private static client = esClient.getClient();

  /**
   * returns the should query.
   *
   * @param filter gets an array of user objects.
   */
  private static prefixQuery(filter: object[]) {
    const should: any[] = [];
    filter.map((user: any) => {
      should.push({
        prefix: {
          'creator.id.keyword': user.id,
        },
      });

      should.push({
        prefix: {
          'assign.id.keyword': user.id,
        },
      });
    });
    return should;
  }
}
