import esClient from '../helpers/elasticsearch.helper';
import Itask from './prediction.interface';
import * as _ from 'lodash';
import { stat } from 'fs';
import { Ingest } from 'elasticsearch';
import getConfig from '../config';
import axios from 'axios';

const config = getConfig();
const alakazamUrl = 'http://localhost:8080/';
export default class PredictionService {
  public static index = 'tasks_test';

  /**
   * Returns the requested result from elasticsearch.
   * @param {string} value The value to search.
   * @param {number} from Date to search from in epoch_millis.
   * @param {number} to Date to search to in epoch_millis.
   * @param {object[]} filter filter by users.
   * @param {string?} field The field to search by, defaults to '_id'.
   */
  public static predictTasksByFilter(
    from: number,
    to: number,
    users: object[] = [],
    officeCreated: boolean,
    officeAssign: boolean,
    filter: any,
    officeMembers: object[] = []
  ) {
    const name = filter['name'] ? filter['name'] : 'created';

    // const should =
    //   officeCreated == false && officeAssign == false
    //     ? TaskService.prefixQuery(filter)
    //     : TaskService.prefixQuery(filter, officeCreated, officeAssign);
    const should = PredictionService.prefixQuery(users);
    const staticMust = [
      {
        range: {
          [name]: {
            gte: from,
            lte: to,
            format: 'epoch_millis',
          },
        },
      },
      // ,{
      //   match: {},
      // },
    ];
    const must: any[] = generateMust(
      staticMust,
      officeMembers,
      officeCreated,
      officeAssign
    );
    let body: any = {
      size: 10000,
      query: {
        bool: {
          must,
          filter: [],
          should,
          minimum_should_match: 1,
          must_not: [],
        },
      },
    };
    const assign_id = filter['assign.id'];
    const status = filter['status'];
    const tag = filter['tag'];

    if (assign_id || status || tag) {
      body.query.bool.must.push({ match: {} });
      const must_last_index = body.query.bool.must.length - 1;
      if (assign_id) {
        body.query.bool.must[must_last_index].match[
          'assign.id.keyword'
        ] = assign_id;
      }
      if (status) {
        body.query.bool.must[must_last_index].match['status.keyword'] = status;
      }
      if (tag) {
        body.query.bool.must[must_last_index] = {
          // query_string: {
          //   default_field: 'tags',
          //   query: tag,
          // },
          match: {
            'tags.keyword': tag,
          },
        };
      }
    }
    return esClient.search({
      index: PredictionService.index,
      body,
    });
  }

  /**
   * Returns the requested result from elasticsearch.
   * @param {string} value The value to search.
   * @param {number} from Date to search from in epoch_millis.
   * @param {number} to Date to search to in epoch_millis.
   * @param {object[]} filter filter by users.
   * @param {string?} field The field to search by, defaults to '_id'.
   */
  public static predictByField(
    value: string,
    from: number,
    to: number,
    filter: object[] = [],
    officeCreated: boolean,
    officeAssign: boolean,
    field?: string,
    officeMembers: object[] = []
  ) {
    const searchField = field || '_id';

    // const should =
    //   officeCreated == false && officeAssign == false
    //     ? TaskService.prefixQuery(filter)
    //     : TaskService.prefixQuery(filter, officeCreated, officeAssign);
    const should = PredictionService.prefixQuery(filter);
    const staticMust = [
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
    ];
    const must: any[] = generateMust(
      staticMust,
      officeMembers,
      officeCreated,
      officeAssign
    );
    const body: any = {
      size: 10000,
      query: {
        bool: {
          must,
          filter: [],
          should,
          minimum_should_match: 1,
          must_not: [],
        },
      },
    };

    body.query.bool.must[1].match[searchField] = value;
    return esClient.search({
      index: PredictionService.index,
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
  public static getMaximalFieldDate(
    field: string,
    from: number,
    // to: number,
    filter: object[] = [],
    officeCreated: boolean,
    officeAssign: boolean,
    interval?: string,
    officeMembers: object[] = []
  ) {
    const should = PredictionService.prefixQuery(filter);
    const staticMust = [
      {
        range: {
          [field]: {
            gte: from,
            // lte: to,
            format: 'epoch_millis',
          },
        },
      },
    ];
    const must: any[] = generateMust(
      staticMust,
      officeMembers,
      officeCreated,
      officeAssign
    );
    return esClient.search({
      index: PredictionService.index,
      body: {
        // aggs: {
        //   1: {
        //     date_histogram: {
        //       field,
        //       // interval: interval || '1d',
        //       interval: '1h',
        //       time_zone: 'Asia/Jerusalem',
        //       min_doc_count: 1,
        //     },
        //   },
        // },
        aggs: {
          min_date: { min: { field: field } },
          max_date: { max: { field: field } },
        },
        // size: 0,
        _source: {
          excludes: [],
        },
        stored_fields: [field],
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
            must,
            filter: [
              {
                match_all: {},
              },
            ],
            should,
            minimum_should_match: 1,
            must_not: [],
          },
        },
      },
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
    // from: number,
    // to: number,
    filter: object[] = [],
    officeCreated: boolean,
    officeAssign: boolean,
    officeMembers: object[] = []
  ) {
    // const should =
    //   officeCreated == false && officeAssign == false
    //     ? TaskService.prefixQuery(filter)
    //     : TaskService.prefixQuery(filter, officeCreated, officeAssign);
    const should = PredictionService.prefixQuery(filter);
    const staticMust: any = [
      // {
      //   range: {
      //     [field]: {
      //       gte: from,
      //       lte: to,
      //       format: 'epoch_millis',
      //     },
      //   },
      // },
    ];
    const must: any[] = generateMust(
      staticMust,
      officeMembers,
      officeCreated,
      officeAssign
    );
    return esClient.search({
      index: PredictionService.index,
      body: {
        aggs: {
          1: {
            date_histogram: {
              field,
              // interval: interval || '1d',
              interval: '1h',
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
            must,
            filter: [
              {
                match_all: {},
              },
            ],
            should,
            minimum_should_match: 1,
            must_not: [],
          },
        },
      },
    });
  }

  //data - an aray of sample objects of the form {ds:"date",y:"numeric value"}
  public static alakazam(data: any) {
    const req = {
      data: data,
    };
    return axios.post(alakazamUrl, req);
  }

  /**
   * Returns the count of tasks per status in a given time range.
   *
   * @param {number} from Date to search from in epoch_millis.
   * @param {number} to Date to search to in epoch_millis.
   * @param {object[]} filter filter by users.
   */
  public static predictCountByStatus(
    from: number,
    to: number,
    filter: object[] = [],
    officeCreated: boolean,
    officeAssign: boolean,
    officeMembers: object[] = []
  ) {
    // const should =
    //   officeCreated == false && officeAssign == false
    //     ? TaskService.prefixQuery(filter)
    //     : TaskService.prefixQuery(filter, officeCreated, officeAssign);
    const should = PredictionService.prefixQuery(filter);
    const staticMust = [
      {
        range: {
          created: {
            gte: from,
            lte: to,
            format: 'epoch_millis',
          },
        },
      },
    ];
    const must: any[] = generateMust(
      staticMust,
      officeMembers,
      officeCreated,
      officeAssign
    );
    return esClient.search({
      index: PredictionService.index,
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
            must,
            filter: [
              {
                match_all: {},
              },
            ],
            should,
            minimum_should_match: 1,
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
  public static predictTagCloud(
    from: number,
    to: number,
    filter: object[] = [],
    officeCreated: boolean,
    officeAssign: boolean,
    size?: number,
    officeMembers: object[] = []
  ) {
    // const should =
    //   officeCreated == false && officeAssign == false
    //     ? TaskService.prefixQuery(filter)
    //     : TaskService.prefixQuery(filter, officeCreated, officeAssign);
    const should = PredictionService.prefixQuery(filter);
    const staticMust = [
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
    ];
    const must: any[] = generateMust(
      staticMust,
      officeMembers,
      officeCreated,
      officeAssign
    );
    return esClient.search({
      index: PredictionService.index,
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
            must,
            filter: [],
            should,
            minimum_should_match: 1,
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
  public static getTotalTasksCount(
    from: number,
    to: number,
    filter: object[] = [],
    officeCreated: boolean,
    officeAssign: boolean,
    size?: number,
    officeMembers: object[] = []
  ) {
    // dont filter by creator only look at assignees
    const should = PredictionService.prefixQuery(filter, false);
    const staticMust = [
      {
        range: {
          created: {
            gte: from,
            lte: to,
            format: 'epoch_millis',
          },
        },
      },
    ];
    const must: any[] = generateMust(
      staticMust,
      officeMembers,
      officeCreated,
      officeAssign
    );
    return esClient.search({
      index: PredictionService.index,
      body: {
        query: {
          bool: {
            must,
            filter: [],
            should,
            minimum_should_match: 1,
            must_not: [],
          },
        },
        aggregations: {
          1: {
            terms: {
              //field: 'assign.id.keyword',
              // the :? operator returns the right side expression if its not null otherwise it returns the left side expression
              // new: "doc['assign.name.keyword'].value + ' ' + doc['assign.lastname.keyword'].value + '\t\t\t\t' + doc['assign.id.keyword'].value ?:doc['assign.name.keyword'].value + '\t\t\t\t' + doc['assign.id.keyword'].value",
              script: config.usersHaveLastNameField
                ? "doc['assign.name.keyword'].value + ' ' + doc['assign.lastname.keyword'].value + '\t\t\t\t' + doc['assign.id.keyword'].value ?:doc['assign.name.keyword'].value + '\t\t\t\t' + doc['assign.id.keyword'].value"
                : "doc['assign.name.keyword'].value + '\t\t\t\t' + doc['assign.id.keyword'].value?:doc['assign.name.keyword'].value + ' ' + doc['assign.lastname.keyword'].value + '\t\t\t\t' + doc['assign.id.keyword'].value ",
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

  /**
   * Returns the first {size} users ordered by completed tasks in a given time range.
   *
   * @param {number} from Date to search from in epoch_millis.
   * @param {number} to Date to search to in epoch_millis.
   * @param {object[]} filter filter by users.
   * @param {number?} size The number of tags, defaults to 10.
   */
  public static predictLeaderboard(
    from: number,
    to: number,
    filter: object[] = [],
    officeCreated: boolean,
    officeAssign: boolean,
    size?: number,
    officeMembers: object[] = []
  ) {
    const should = PredictionService.prefixQuery(filter, true, false);
    const staticMust = [
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
    ];
    const must: any[] = generateMust(
      staticMust,
      officeMembers,
      officeCreated,
      officeAssign
    );
    let esQuery: any = {
      index: PredictionService.index,
      body: {
        query: {
          bool: {
            must,
            filter: [],
            should,
            minimum_should_match: 1,
            must_not: [],
          },
        },
        aggregations: {
          1: {
            terms: {
              //field: 'assign.id.keyword',
              // the :? operator returns the right side expression if its not null otherwise it returns the left side expression
              // new: "doc['assign.name.keyword'].value + ' ' + doc['assign.lastname.keyword'].value + '\t\t\t\t' + doc['assign.id.keyword'].value ?:doc['assign.name.keyword'].value + '\t\t\t\t' + doc['assign.id.keyword'].value",
              field: 'assign.id.keyword',
              size: size || 10,
              order: {
                _count: 'desc',
              },
            },
          },
        },
      },
    };
    return esClient.search(esQuery);
  }

  /**
   * returns the should query.
   *
   * @param filter gets an array of user objects.
   * @param filterByCreator if set to true will filter by creator, default to true.
   * @param filterByAssignee if set to true will filter by assignee, default to true.
   */
  private static prefixQuery(
    filter: object[],
    filterByCreator?: boolean,
    filterByAssignee?: boolean
  ) {
    filterByCreator = _.defaultTo(filterByCreator, true);
    filterByAssignee = _.defaultTo(filterByAssignee, true);
    const should: any[] = [];

    filter.map((user: any) => {
      if (filterByCreator)
        should.push({
          prefix: {
            'creator.id.keyword': user.id,
          },
        });
      if (filterByAssignee)
        should.push({
          prefix: {
            'assign.id.keyword': user.id,
          },
        });
    });

    return should;
  }
}

function generateOfficeMembersMust(
  officeMembers: object[],
  officeCreated: boolean,
  officeAssign: boolean
) {
  const officeMembersIDs = officeMembers; //_.map(officeMembers, (om: any) => om.id);
  if (officeMembers.length <= 0) return {};
  if (officeCreated)
    return {
      query_string: {
        fields: ['creator.id.keyword'],
        query: _.map(officeMembersIDs, id => `${id}*`).join(' OR '),
        minimum_should_match: 1,
      },
    };
  else if (officeAssign)
    return {
      query_string: {
        fields: ['assign.id.keyword'],
        query: _.map(officeMembersIDs, id => `${id}*`).join(' OR '),
        minimum_should_match: 1,
      },
    };
  return {};
}

function generateMust(
  staticMust: any[],
  officeMembers: object[],
  officeCreated: boolean,
  officeAssign: boolean
) {
  if (
    generateOfficeMembersMust(officeMembers, officeCreated, officeAssign)
      .query_string
  )
    staticMust.push(
      generateOfficeMembersMust(officeMembers, officeCreated, officeAssign)
    );
  return staticMust;
}
