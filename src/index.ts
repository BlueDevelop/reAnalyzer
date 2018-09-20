import express from 'express';
import cors from 'cors';
import session from 'express-session';
import {connect, connection} from 'mongoose';
const MongoStore = require('connect-mongo')(session);

import getConfig from './config';
import passport from './auth/passport';

const config = getConfig();
const app = express();

(function init() {
    process.on('uncaughtException', err => {
        console.log(err);
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
    connect(config.connString, { useNewUrlParser: true });
}

function setMiddlewares() {
    app.use(cors());
    app.use(session({
        secret: config.sessionSecret,
        resave: true,
        saveUninitialized: false,
        store: new MongoStore({
            mongooseConnection: connection
        })
    }));
    passport(app);
}

function setRoutes() {
    app.get('/', (_, res) => {
        res.send('Hello, World!');
    });

    
}