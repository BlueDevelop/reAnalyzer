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
  userIDToOfficeMembersFile: string; // maps each user id to its office members
  hierarchyUserIDToHierarchyFile?: string; // local file containing a mapping between userIDS and its hierarchy
  hierarchyGroupIdToGroupName?: string; // maps group id to group name and vice versa
  hierarchyServiceAddrGetMembers?: (hierarchy: string) => string; // function that generates the route to get all members\users under a given hierarchy from the api
  hierarchyServiceAddrGetUser?: (userID: string) => string; // function that generates the route to get a single user\member info
  debug?: boolean;
}

const prod: IConfig = {
  port: process.env.PORT ? +process.env.PORT : 3000,
  connString:
    process.env.MONGO ||
    'mongodb://localhost:27017,localhost:27017,localhost:27017/reAnalyzer_prod?replicaSet=reAnalyzer',
  sessionSecret: process.env.secret || 'OmerIsTheBestProgrammer',
  logLevel: process.env.LOGLEVEL || 'info',
  apmAdress: process.env.APM_ADDR || 'http://apm:8200',
  apmServiceName: process.env.APM_NAME || 'reAnalyzer_prod',
  elasticsearch: process.env.ELASTIC || 'http://elasticsearch:9200',
  hierarchyServiceAddr:
    process.env.hierarchyAPI || 'http://hierarchyServiceAddress/api/',
  hierarchyFile: path.join(__dirname, '../src/someGroupIDmock/hierarchy.json'),
  userIDToOfficeMembersFile: 'blabla',
  hierarchyServiceUseMock: false,
  hierarchyServiceAddrGetMembers: (hierarchyID: string) =>
    `${prod.hierarchyServiceAddr}hierarchy/${hierarchyID}/members`,
  hierarchyServiceAddrGetUser: (userID: string) =>
    `${prod.hierarchyServiceAddr}user/${userID}`,
  debug: process.env.DEBUG
    ? process.env.DEBUG === 'true'
      ? true
      : false
    : false,
};

const dev: IConfig = {
  port: process.env.PORT ? +process.env.PORT : 3000,
  connString: process.env.MONGO || 'mongodb://mongodb:27017/reAnalyzer_dev',
  sessionSecret: 'OmerIsTheBestProgrammer',
  logLevel: process.env.LOGLEVEL || 'verbose',
  apmAdress: process.env.APM_ADDR || 'http://apm:8200',
  apmServiceName: process.env.APM_NAME || 'reAnalyzer_dev',
  elasticsearch: process.env.ELASTIC || 'http://elasticsearch:9200',
  hierarchyServiceMockFile: path.join(__dirname, '../src/mock/members.json'),
  hierarchyServiceUseMock: true,
  hierarchyFile: path.join(__dirname, '../src/mock/hierarchy.json'),
  userIDToOfficeMembersFile: path.join(
    __dirname,
    '../src/mock/userIDToOfficeMembers.json'
  ),
  hierarchyUserIDToHierarchyFile: path.join(
    __dirname,
    '../src/mock/userIDToHierarchy.json'
  ),

  hierarchyGroupIdToGroupName: path.join(
    __dirname,
    '../src/mock/hierarchyGroupIdToGroupName.json'
  ),
  debug: process.env.DEBUG
    ? process.env.DEBUG === 'true'
      ? true
      : false
    : false,
};

const local: IConfig = {
  port: process.env.PORT ? +process.env.PORT : 3000,
  connString: process.env.MONGO || 'mongodb://localhost:27017/reAnalyzer_dev',
  sessionSecret: 'OmerIsTheBestProgrammer',
  logLevel: process.env.LOGLEVEL || 'verbose',
  apmAdress: process.env.APM_ADDR || 'http://localhost:8200',
  apmServiceName: process.env.APM_NAME || 'reAnalyzer_dev',
  elasticsearch: process.env.ELASTIC || 'http://localhost:9200',
  hierarchyServiceMockFile: path.join(__dirname, '../src/mock/members.json'),
  userIDToOfficeMembersFile: path.join(
    __dirname,
    '../src/mock/userIDToOfficeMembers.json'
  ),
  hierarchyServiceUseMock: true,
  hierarchyUserIDToHierarchyFile: path.join(
    __dirname,
    '../src/mock/userIDToHierarchy.json'
  ),
  debug: process.env.DEBUG
    ? process.env.DEBUG === 'true'
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
  userIDToOfficeMembersFile: path.join(
    __dirname,
    '../src/mock/userIDToOfficeMembers.json'
  ),
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
