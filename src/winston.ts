import * as winston from 'winston';

import { staticConfig } from '@/config';

const customLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
  trace: 7,
};
const customLevelColors = {
  fatal: 'violet',
  error: 'red',
  warn: 'yellow',
  info: 'green',
  verbose: 'cyan',
  debug: 'blue',
  silly: 'magenta',
  trace: 'grey',
};

winston.addColors(customLevelColors);

export const WinstonOptions = {
  levels: customLevels,
  transports: [
    new winston.transports.Console({
      level: staticConfig.logLevel,
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, context }) => {
          return `[${timestamp}] [${context || 'App'}] ${level}: ${message}`;
        }),
      ),
    }),
  ],
};
