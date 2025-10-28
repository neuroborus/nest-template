import { staticConfig } from '@/config';

export const pinoHttp = {
  level: staticConfig.logLevel,
  redact: {
    paths: [
      // Defaults
      'req.headers.authorization',
      'req.headers.cookie',
      'req.headers.authorize',
      'res.headers["set-cookie"]',

      'req.body.token',
      'req.body.refreshToken',
      'req.body.clientSecret',
    ],
    censor: '***',
  },

  transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l o',
          singleLine: true,
          levelFirst: true,
          ignore: 'pid,hostname,context',
        },
      },
};
