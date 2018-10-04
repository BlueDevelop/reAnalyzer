import express from 'express';
import cors from 'cors';
import session from 'express-session';
import {connect, connection} from 'mongoose';
import {json, urlencoded} from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import morgan from 'morgan';
const MongoStore = require('connect-mongo')(session);

import getConfig from './config';
import * as passport from './auth/passport';
import userRoutes from './users/user.router';
import morganLogger from './loggers/morgan.logger';
import authenticate from './auth/auth.middleware';


const config = getConfig();
export const app = express();

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
    app.disable('x-powered-by');
    app.use(json());
    app.use(urlencoded({extended: true}));
    app.use(cookieParser());
    app.use(cors());
    app.use(morgan('combined', {
        skip: (_, res) => res.statusCode < 400,
        stream: {
            write: (meta) => {
                morganLogger.error(meta);
            }
        }
    }));

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
    // Static files
    app.use(express.static(path.join(__dirname, '../client/dist/App')));

    app.get('*', (_, res) => {
        res.sendFile(path.join(__dirname, '../client/dist/App/index.html'));
    });

    app.use('/api/user', userRoutes);
}