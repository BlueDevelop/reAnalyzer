import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiHttp from 'chai-http';
import esClient from '../helpers/elasticsearch.helper';
import data from './taskdata';
import taskService from './task.service';

const server = require('../index').app;
const expect = chai.expect;

chai.use(chaiAsPromised);
chai.use(chaiHttp);

const client = esClient.getClient();
const index = 'tasks_unittest';
taskService.index = index;

before('Insert data into index: ' + index, async () => {
  await client.bulk({
    body: data(index),
    refresh: 'wait_for',
  });
});

describe('Task Service', () => {
  describe('getByField', () => {
    it('should find by _id field - there is no filter so the response will be empty', async () => {
      const res = await taskService.getByField(
        '5bbc5fd0981efd8c875828ae',
        1538341200000,
        1541023199999
      );
      expect(res.hits.hits).to.exist;
      expect(res.hits.hits).to.be.empty;
    });
    it('should find by _id field', async () => {
      const res = await taskService.getByField(
        '5bbc5fd0981efd8c875828ae',
        1538341200000,
        1541023199999,
        [{ id: 'Wilfred_Kautzer9' }, { id: 'fuckerson' }]
      );
      expect(res.hits.hits[0]).to.exist;
      expect(res.hits.hits[0]).to.have.property(
        '_id',
        '5bbc5fd0981efd8c875828ae'
      );
    });

    it('should find by _id field', async () => {
      const res = await taskService.getByField(
        '5bbc5fd0981efd8c875828ae',
        1538341200000,
        1541023199999,
        [{ id: 'Wilfred_Kautzer9' }, { id: 'fuckerson' }]
      );
      expect(res.hits.hits[0]).to.exist;
      expect(res.hits.hits[0]).to.have.property(
        '_id',
        '5bbc5fd0981efd8c875828ae'
      );
    });
  });
});

after('delete data from index: ' + index, async () => {
  await client.deleteByQuery({
    index,
    body: {
      query: { match_all: {} },
    },
  });
});
