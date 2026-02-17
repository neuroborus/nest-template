import { ConfigService } from '@nestjs/config';
import { HealthService } from '@/services/health';

describe('HealthService', () => {
  it('returns health payload from config values', () => {
    const getOrThrow = jest
      .fn()
      .mockImplementation((key: string) => (key === 'port' ? 3100 : 'debug'));
    const config = { getOrThrow } as unknown as ConfigService;

    const service = new HealthService(config);

    expect(service.check()).toEqual({
      status: 'OK',
      port: 3100,
      logLevel: 'debug',
    });
    expect(getOrThrow).toHaveBeenNthCalledWith(1, 'port');
    expect(getOrThrow).toHaveBeenNthCalledWith(2, 'logLevel');
  });

  it('propagates config errors', () => {
    const config = {
      getOrThrow: jest.fn().mockImplementation(() => {
        throw new Error('missing config');
      }),
    } as unknown as ConfigService;

    const service = new HealthService(config);

    expect(() => service.check()).toThrow('missing config');
  });
});
