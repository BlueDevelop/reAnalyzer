import {Logger, transports} from 'winston';
require('winston-daily-rotate-file');
import getConfig from '../config';

const logLevel = getConfig().logLevel;

export default new Logger({
    transports: [
        new transports.DailyRotateFile({
            filename: 'logs/%DATE%/info.log',
            datePattern: 'YYYY-MM-DD',
            level: logLevel,
            maxsize: '1000m',
            maxFiles: '30d'
        })
    ]
});