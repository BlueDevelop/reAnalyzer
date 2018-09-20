interface IConfig {
    port: number,
    connString: string
}

const prod: IConfig = {
    port: 3000,
    connString: 'mongodb://localhost:27017,localhost:27017,localhost:27017/reAnalyzer_prod?replica=reAnalyzer'
};

const dev: IConfig = {
    port: 3000,
    connString: 'mongodb://localhost:27017/reAnalyzer_dev'
};

const test: IConfig = {
    port: 3000,
    connString: 'mongodb://localhost:27017/reAnalyzer_test'
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