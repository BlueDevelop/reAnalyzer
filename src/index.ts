import getConfig from './config';
const config = getConfig();

const apm = require('elastic-apm-node').start({
    // Set required service name (allowed characters: a-z, A-Z, 0-9, -, _, and space)
    serviceName: config.apmServiceName,
  
    // Set custom APM Server URL (default: http://localhost:8200)
    serverUrl: config.apmAdress
});
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import {connect, connection, Mongoose} from 'mongoose';
import {json, urlencoded} from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import morgan from 'morgan';
import os from 'os';
const MongoStore = require('connect-mongo')(session);

import * as passport from './auth/passport';
import userRoutes from './users/user.router';
import morganLogger from './loggers/morgan.logger';
import errorLogger from './loggers/error.logger';
import verboseLogger from './loggers/verbose.logger';
import infoLogger from './loggers/info.logger';
import authenticate from './auth/auth.middleware';
import taskController from './tasks/task.controller';

export const app = express();

(function init() {
    process.on('uncaughtException', err => {
        console.log(err);
        errorLogger.error('%j', {
            message: err.message,
            stack: err.stack,
            name:err.name
        });
        process.exit(1);
    });

    initDbConnection();
    setMiddlewares();
    setRoutes();

    app.listen(config.port, () => {
        verboseLogger.info(`Server is listening on port ${config.port}`);
        console.log(`Server is listening on port ${config.port}`);
    });
})();

function initDbConnection() {
    connect(config.connString, { useNewUrlParser: true }, err => {
        if (err) {
            errorLogger.error('%j', {
                message: err.message,
                stack: err.stack,
                name:err.name
            });
            process.exit(1);
        }
    });

    connection.on('connected', () => {
        verboseLogger.info(`Server is connected to ${config.connString}`);
    });

    connection.on('disconnected', () => {
        errorLogger.error(`Server disconnected from ${config.connString}`);
    });

    connection.on('reconnected', () => {
        verboseLogger.info(`Server reconnected to ${config.connString}`);
    });
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
    app.use('/api/user', userRoutes);

    app.get('/api/isAlive', (_, res) => {
        if (connection.readyState) {
            return res.send('ok');
        }
        return res.status(500).send();
    });

    app.get('/api/hostname', (_, res) => {
        return res.send(os.hostname());
    });

    app.get('/api/ruok', (_, res) => {
        if (connection.readyState) {
            return res.send('ok');
        }
        return res.status(500).send();    
    });

    // Static files
    app.use(express.static(path.join(__dirname, '../client/dist/App')));

    app.get('*', (_, res) => {
        res.sendFile(path.join(__dirname, '../client/dist/App/index.html'));
    });
}