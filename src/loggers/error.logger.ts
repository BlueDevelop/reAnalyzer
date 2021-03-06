import { Logger, transports } from 'winston';
require('winston-daily-rotate-file');
import getConfig from '../config';

const logLevel = getConfig().logLevel;
const debug = getConfig().debug || false;

export default new Logger({
  transports: [
    new transports.DailyRotateFile({
      filename: 'logs/%DATE%/error.log',
      datePattern: 'YYYY-MM-DD',
      level: logLevel,
      handleExceptions: true,
      humanReadableUnhandledException: true,
      maxsize: '1000m',
      maxFiles: '30d',
    }),
    new transports.Console({
      level: logLevel,
      silent: !debug,
    }),
  ],
  exitOnError: false,
});
