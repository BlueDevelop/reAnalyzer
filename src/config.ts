import hierarchyService from "./helpers/userhierarchy.helper";

interface IConfig {
  port: number;
  connString: string;
  sessionSecret: string;
  logLevel: string;
  apmAdress: string;
  apmServiceName: string;
  elasticsearch: string;
  hierarchyServiceAddr?: string;
  hierarchyServiceMockFile?: string;
  hierarchyServiceAddrGetMembers?: (hierarchy: string) => string;
}

const prod: IConfig = {
  port: 3000,
  connString:
    "mongodb://localhost:27017,localhost:27017,localhost:27017/reAnalyzer_prod?replica=reAnalyzer",
  sessionSecret: "OmerIsTheBestProgrammer",
  logLevel: "info",
  apmAdress: "http://apm:8200",
  apmServiceName: "reAnalyzer_prod",
  elasticsearch: "http://elasticsearch:9200",
  hierarchyServiceAddr: "http://hierarchyServiceAddress/api/hierarchy/",
  hierarchyServiceAddrGetMembers: (hierarchyID: string) =>
    `${prod.hierarchyServiceAddr}${hierarchyID}/members`
};

const dev: IConfig = {
  port: 3000,
  connString: "mongodb://mongodb:27017/reAnalyzer_dev",
  sessionSecret: "OmerIsTheBestProgrammer",
  logLevel: "verbose",
  apmAdress: "http://apm:8200",
  apmServiceName: "reAnalyzer_dev",
  elasticsearch: "http://elasticsearch:9200",
  hierarchyServiceMockFile: "./mock/members.json"
};

const test: IConfig = {
  port: 3001,
  connString: "mongodb://localhost:27017/reAnalyzer_test",
  sessionSecret: "OmerIsTheBestProgrammer",
  logLevel: "verbose",
  apmAdress: "http://localhost:8200",
  apmServiceName: "reAnalyzer_test",
  elasticsearch: "http://localhost:9200"
};

export default () => {
  switch (process.env.NODE_ENV) {
    case "prod": {
      return prod;
    }

    case "dev": {
      return dev;
    }

    case "test": {
      return test;
    }

    default: {
      return dev;
    }
  }
};
