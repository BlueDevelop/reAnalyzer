import { Logger, transports } from 'winston';
require('winston-daily-rotate-file');

export default new Logger({
  transports: [
    new transports.DailyRotateFile({
      filename: 'logs/%DATE%/morgan.log',
      datePattern: 'YYYY-MM-DD',
      maxsize: '1000m',
      maxFiles: '30d',
    }),
  ],
});
