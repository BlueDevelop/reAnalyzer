import hierarchyService from './helpers/userhierarchy.helper';
import path from 'path';

interface IConfig {
  port: number;
  connString: string;
  sessionSecret: string;
  logLevel: string;
  apmAdress: string;
  apmServiceName: string;
  elasticsearch: string;
  hierarchyServiceUseMock: boolean; // if true will use mockfile to instead of api
  hierarchyServiceAddr?: string; // the address of the users\hierarchies API
  hierarchyServiceMockFile?: string; // local file describing return value for each hierarchy id
  hierarchyServiceGroupMembersFile?: string; // local file describing each groups members,
  hierarchyFile?: string; // local file describing indirect sub groups of a each group
  hierarchyUserIDToHierarchyFile?: string; // local file containing a mapping between userIDS and its hierarchy
  hierarchyServiceAddrGetMembers?: (hierarchy: string) => string; // function that generates the route to get all members\users under a given hierarchy from the api
  hierarchyServiceAddrGetUser?: (userID: string) => string; // function that generates the route to get a single user\member info
  debug?: boolean;
}

const prod: IConfig = {
  port: process.env.port ? +process.env.port : 3000,
  connString:
    process.env.MONGO ||
    'mongodb://localhost:27017,localhost:27017,localhost:27017/reAnalyzer_prod?replicaSet=reAnalyzer',
  sessionSecret: process.env.secret || 'OmerIsTheBestProgrammer',
  logLevel: process.env.logLevel || 'info',
  apmAdress: process.env.apm || 'http://apm:8200',
  apmServiceName: 'reAnalyzer_prod',
  elasticsearch: process.env.ELASTIC || 'http://elasticsearch:9200',
  hierarchyServiceAddr:
    process.env.hierarchyAPI || 'http://hierarchyServiceAddress/api/',
  hierarchyFile: path.join(__dirname, '../src/someGroupIDmock/hierarchy.json'),
  hierarchyServiceUseMock: false,
  hierarchyServiceAddrGetMembers: (hierarchyID: string) =>
    `${prod.hierarchyServiceAddr}hierarchy/${hierarchyID}/members`,
  hierarchyServiceAddrGetUser: (userID: string) =>
    `${prod.hierarchyServiceAddr}user/${userID}`,
  debug: process.env.debug
    ? process.env.debug == 'true'
      ? true
      : false
    : false,
};

const dev: IConfig = {
  port: process.env.port ? +process.env.port : 3000,
  connString: process.env.MONGO || 'mongodb://mongodb:27017/reAnalyzer_dev',
  sessionSecret: 'OmerIsTheBestProgrammer',
  logLevel: 'verbose',
  apmAdress: 'http://apm:8200',
  apmServiceName: 'reAnalyzer_dev',
  elasticsearch: 'http://elasticsearch:9200',
  hierarchyServiceMockFile: path.join(__dirname, '../src/mock/members.json'),
  hierarchyServiceUseMock: true,
  hierarchyUserIDToHierarchyFile: path.join(
    __dirname,
    '../src/mock/userIDToHierarchy.json'
  ),
  debug: process.env.debug
    ? process.env.debug == 'true'
      ? true
      : false
    : false,
};

const local: IConfig = {
  port: process.env.port ? +process.env.port : 3000,
  connString: process.env.MONGO || 'mongodb://localhost:27017/reAnalyzer_dev',
  sessionSecret: 'OmerIsTheBestProgrammer',
  logLevel: 'verbose',
  apmAdress: 'http://localhost:8200',
  apmServiceName: 'reAnalyzer_dev',
  elasticsearch: 'http://localhost:9200',
  hierarchyServiceMockFile: path.join(__dirname, '../src/mock/members.json'),
  hierarchyServiceUseMock: true,
  hierarchyUserIDToHierarchyFile: path.join(
    __dirname,
    '../src/mock/userIDToHierarchy.json'
  ),
  debug: process.env.debug
    ? process.env.debug == 'true'
      ? true
      : false
    : false,
};

const test: IConfig = {
  port: 3001,
  connString: 'mongodb://localhost:27017/reAnalyzer_test',
  sessionSecret: 'OmerIsTheBestProgrammer',
  logLevel: 'verbose',
  apmAdress: 'http://localhost:8200',
  apmServiceName: 'reAnalyzer_test',
  elasticsearch: 'http://localhost:9200',
  hierarchyServiceUseMock: false,
};

export default () => {
  switch (process.env.NODE_ENV) {
    case 'prod': {
      return prod;
    }

    case 'dev': {
      return dev;
    }
    case 'local': {
      return local;
    }
    case 'test': {
      return test;
    }

    default: {
      return dev;
    }
  }
};
