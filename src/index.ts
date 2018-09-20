import express from 'express';
import cors from 'cors';
import session from 'express-session';
import * as mongoose from 'mongoose';
const MongoStore = require('connect-mongo')(session);

import getConfig from './config';
import passport from './auth/passport';

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
    mongoose.connect(config.connString);
}

function setMiddlewares() {
    app.use(cors());
    app.use(session({
        secret: '',
        resave: true,
        saveUninitialized: false,
        store: new MongoStore({
            mongooseConnection: mongoose.connection
        })
    }));
    passport(app);
}

function setRoutes() {
    app.get('/', (_, res) => {
        res.send('Hello, World!');
    });

    
}