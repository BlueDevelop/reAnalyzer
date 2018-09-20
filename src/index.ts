import express from 'express';
import cors from 'cors';
import session from 'express-session';
import {connect, connection} from 'mongoose';
import {json, urlencoded} from 'body-parser';
import cookieParser from 'cookie-parser';
const MongoStore = require('connect-mongo')(session);

import getConfig from './config';
import * as passport from './auth/passport';
import userRoutes from './users/user.router';
import authenticate from './auth/auth.middleware';


const config = getConfig();
const app = express();

(function init() {
    process.on('uncaughtException', err => {
        console.error(err);
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
    app.use(json());
    app.use(urlencoded({extended: true}));
    app.use(cookieParser());
    app.use(cors());
    app.use(session({
        secret: config.sessionSecret,
        resave: true,
        saveUninitialized: false,
        store: new MongoStore({
            mongooseConnection: connection
        })
    }));
    passport.init(app);
}

function setRoutes() {
    app.get('/', authenticate, (_, res) => {
        res.send('Hello, World!');
    });

    app.use('/api/user', userRoutes);
}