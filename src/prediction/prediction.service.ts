import esClient from '../helpers/elasticsearch.helper';
import Itask from './prediction.interface';
import * as _ from 'lodash';
import { stat } from 'fs';
import { Ingest } from 'elasticsearch';
import getConfig from '../config';
import axios from 'axios';

const config = getConfig();
export default class PredictionService {
  public static index = 'tasks_test';

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
    const staticMust: any = [];
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
        // size: 0,
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
      seasonalities: [
        {
          name: 'monthly',
          period: 30.5,
        },
        {
          name: 'weekly',
          period: 7,
        },
        {
          name: 'yearly',
          period: 365,
        },
      ],
    };
    return axios.post(config.alakazam, req);
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
