interface IConfig {
    port: number,
    connString: string,
    sessionSecret: string
}

const prod: IConfig = {
    port: 3000,
    connString: 'mongodb://localhost:27017,localhost:27017,localhost:27017/reAnalyzer_prod?replica=reAnalyzer',
    sessionSecret: 'OmerIsTheBestProgrammer'
};

const dev: IConfig = {
    port: 3000,
    connString: 'mongodb://localhost:27017/reAnalyzer_dev',
    sessionSecret: 'OmerIsTheBestProgrammer'
};

const test: IConfig = {
    port: 3000,
    connString: 'mongodb://localhost:27017/reAnalyzer_test',
    sessionSecret: 'OmerIsTheBestProgrammer'
};

export default () => {
    switch (process.env.NODE_ENV) {
        case 'prod': {
            return prod;
        }

        case 'dev': {
            return dev;
        }

        case 'test': {
            return test;
        }

        default: {
            return dev;
        }
    }
}