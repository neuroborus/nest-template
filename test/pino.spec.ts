import { pinoHttp } from '@/pino';
import { staticConfig } from '@/config';

describe('pinoHttp', () => {
  it('uses configured log level and redacts sensitive data', () => {
    expect(pinoHttp.level).toBe(staticConfig.logLevel);
    expect(pinoHttp.redact?.censor).toBe('***');
    expect(pinoHttp.redact?.paths).toEqual(
      expect.arrayContaining([
        'req.headers.authorization',
        'req.headers.cookie',
        'res.headers["set-cookie"]',
        'req.body.token',
        'req.body.refreshToken',
        'req.body.clientSecret',
      ]),
    );
  });

  it('uses pretty transport in current setup', () => {
    expect(pinoHttp.transport).toEqual(
      expect.objectContaining({
        target: 'pino-pretty',
      }),
    );
  });
});
