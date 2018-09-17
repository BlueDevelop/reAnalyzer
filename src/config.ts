interface IConfig {
    port: number
}

const prod: IConfig = {
    port: 3000
};

const dev: IConfig = {
    port: 3000
};

const test: IConfig = {
    port: 3000
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