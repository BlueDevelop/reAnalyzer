import path from 'path';

interface ISaml {
  entryPoint: string;
  issuer: string;
  callbackUrl: string;
  authnContext: string;
  identifierFormat: string | null;
  signatureAlgorithm: string;
  acceptedClockSkewMs: number;
}
interface IShraga {
  callbackURL?: string;
  shragaURL?: string;
  transform?: any;
}

interface IConfig {
  port: number;
  connString: string;
  sessionSecret: string;
  logLevel: string;
  apmAdress: string;
  apmServiceName: string;
  elasticsearch: string;
  alakazam: string;
  hierarchyServiceUseMock: boolean; // if true will use mockfile to instead of api
  hierarchyServiceAddr?: string; // the address of the users\hierarchies API
  hierarchyServiceMockFile?: string; // local file describing return value for each hierarchy id
  hierarchyServiceGroupMembersFile?: string; // local file describing each groups members,
  hierarchyFile?: string; // local file describing indirect sub groups of a each group
  userIDToOfficeMembersFile?: string; // maps each user id to its office members
  hierarchyUserIDToHierarchyFile?: string; // local file containing a mapping between userIDS and its hierarchy
  hierarchyGroupIdToGroupName?: string; // maps group id to group name and vice versa
  hierarchyServiceAddrGetMembers?: (hierarchy: string) => string; // function that generates the route to get all members\users under a given hierarchy from the api
  hierarchyServiceAddrGetUser?: (userID: string) => string; // function that generates the route to get a single user\member info
  hierarchyServiceAddrGetMembersUnderUser?: (userID: string) => string;
  hierarchyServiceAddrGetDirectSubHierarchiesFromUser?: (
    userId: string
  ) => string;
  hierarchyServiceAddrGetMembersDirectlyUnderHierarchy?: (
    HierarchyID: string
  ) => string;
  debug?: boolean;
  useSaml?: boolean;
  usersHaveLastNameField?: boolean;
  saml?: ISaml;
  shraga?: IShraga;
  useShraga?: boolean;
  samlClaimMapper?: any; // used in the saml strategy to map profile keys to id,firstName,lastName
  specialProjectId: string;
  specialhierarchies: string[];
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
  alakazam: process.env.ALAKAZAM || 'http://localhost:8080/',
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
  specialProjectId: process.env.SPECIAL_PROJECT_ID
    ? process.env.SPECIAL_PROJECT_ID
    : '',
  specialhierarchies: process.env.SPECIAL_HIERARCHIES
    ? process.env.SPECIAL_HIERARCHIES.split(' ')
    : [],
};

const dev: IConfig = {
  port: process.env.PORT ? +process.env.PORT : 3000,
  connString: process.env.MONGO || 'mongodb://mongodb:27017/reAnalyzer_dev',
  sessionSecret: 'OmerIsTheBestProgrammer',
  logLevel: process.env.LOGLEVEL || 'verbose',
  apmAdress: process.env.APM_ADDR || 'http://apm:8200',
  apmServiceName: process.env.APM_NAME || 'momentum_dev',
  elasticsearch: process.env.ELASTIC || 'http://elasticsearch:9200',
  alakazam: process.env.ALAKAZAM || 'http://localhost:8080/',
  // hierarchyServiceMockFile: path.join(__dirname, '../src/mock/members.json'),
  hierarchyServiceUseMock: true,
  // hierarchyFile: path.join(__dirname, '../src/mock/hierarchy.json'),
  hierarchyServiceAddrGetMembers: hierarchyID =>
    `http://neo4j-server:8001/personsUnderHierarchy/${hierarchyID}`,
  hierarchyServiceAddrGetMembersUnderUser: userID =>
    `http://neo4j-server:8001/personsUnderPerson/${userID}`,
  hierarchyServiceAddrGetDirectSubHierarchiesFromUser: userID =>
    `http://neo4j-server:8001/subHierarchiesByPersonID/${userID}`,
  hierarchyServiceAddrGetMembersDirectlyUnderHierarchy: hierarchyID =>
    `http://neo4j-server:8001/personsDirectlyUnderHierarchy/${hierarchyID}`,
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
  specialProjectId: process.env.SPECIAL_PROJECT_ID
    ? process.env.SPECIAL_PROJECT_ID
    : '',
  specialhierarchies: process.env.SPECIAL_HIERARCHIES
    ? process.env.SPECIAL_HIERARCHIES.split(' ')
    : [],
};

const local: IConfig = {
  port: process.env.PORT ? +process.env.PORT : 4000,
  connString: process.env.MONGO || 'mongodb://localhost:27017/reAnalyzer_dev',
  sessionSecret: 'OmerIsTheBestProgrammer',
  logLevel: process.env.LOGLEVEL || 'verbose',
  apmAdress: process.env.APM_ADDR || 'http://localhost:8200',
  apmServiceName: process.env.APM_NAME || 'momentum_dev',
  elasticsearch: process.env.ELASTIC || 'http://localhost:9200',
  alakazam: process.env.ALAKAZAM || 'http://localhost:8080/',
  // hierarchyServiceMockFile: path.join(__dirname, '../src/mock/members.json'),
  hierarchyServiceUseMock: true,
  // hierarchyFile: path.join(__dirname, '../src/mock/hierarchy.json'),
  hierarchyServiceAddrGetMembers: hierarchyID =>
    `http://localhost:8001/personsUnderHierarchy/${hierarchyID}`,
  hierarchyServiceAddrGetMembersUnderUser: userID =>
    `http://localhost:8001/personsUnderPerson/${userID}`,
  hierarchyServiceAddrGetDirectSubHierarchiesFromUser: userID =>
    `http://localhost:8001/subHierarchiesByPersonID/${userID}`,
  hierarchyServiceAddrGetMembersDirectlyUnderHierarchy: hierarchyID =>
    `http://localhost:8001/personsDirectlyUnderHierarchy/${hierarchyID}`,
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
  shraga: {
    shragaURL: 'http://localhost:3000',
    callbackURL: 'http://localhost:4200/api/login/callback',
  },
  useShraga: true,
  specialProjectId: process.env.SPECIAL_PROJECT_ID
    ? process.env.SPECIAL_PROJECT_ID
    : '',
  specialhierarchies: process.env.SPECIAL_HIERARCHIES
    ? process.env.SPECIAL_HIERARCHIES.split(' ')
    : [],
};

const test: IConfig = {
  port: 3001,
  connString: 'mongodb://localhost:27017/reAnalyzer_test',
  sessionSecret: 'OmerIsTheBestProgrammer',
  logLevel: 'verbose',
  apmAdress: 'http://localhost:8200',
  apmServiceName: 'reAnalyzer_test',
  elasticsearch: 'http://localhost:9200',
  alakazam: process.env.ALAKAZAM || 'http://localhost:8080/',
  hierarchyServiceUseMock: false,
  userIDToOfficeMembersFile: path.join(
    __dirname,
    '../src/mock/userIDToOfficeMembers.json'
  ),
  specialProjectId: process.env.SPECIAL_PROJECT_ID
    ? process.env.SPECIAL_PROJECT_ID
    : '',
  specialhierarchies: process.env.SPECIAL_HIERARCHIES
    ? process.env.SPECIAL_HIERARCHIES.split(' ')
    : [],
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
