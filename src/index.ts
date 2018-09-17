import express from 'express';
import cors from 'cors';

import getConfig from './config';

const config = getConfig();
const app = express();

(function init() {
    process.on('uncaughtException', err => {
        process.exit(1);
    });

    initDbConnection();
    setMiddlewares();
    setRoutes();

    app.listen(config.port, () => {
        console.log(`Server is listening on port ${config.port}`);
    });
})();

function initDbConnection() {

}

function setMiddlewares() {
    app.use(cors());
}

function setRoutes() {
    app.get('/', (_, res) => {
        res.send('Hello, World!');
    });
}