describe('staticConfig', () => {
  const originalPort = process.env.PORT;
  const originalLogLevel = process.env.LOG_LEVEL;

  afterEach(() => {
    jest.resetModules();

    if (originalPort === undefined) {
      delete process.env.PORT;
    } else {
      process.env.PORT = originalPort;
    }

    if (originalLogLevel === undefined) {
      delete process.env.LOG_LEVEL;
    } else {
      process.env.LOG_LEVEL = originalLogLevel;
    }
  });

  it('uses defaults when env vars are missing', async () => {
    process.env.PORT = '';
    process.env.LOG_LEVEL = '';

    const { staticConfig } = await import('@/config/static-config');

    expect(staticConfig.port).toBe(3000);
    expect(staticConfig.logLevel).toBe('info');
    expect(staticConfig.nodeEnv).toBeDefined();
    expect(staticConfig.databaseUrl).toBeDefined();
    expect(staticConfig.auth).toEqual(
      expect.objectContaining({
        accessSecret: expect.any(String),
        refreshSecret: expect.any(String),
      }),
    );
  });

  it('normalizes configured values', async () => {
    process.env.PORT = '4321';
    process.env.LOG_LEVEL = 'DEBUG';

    const { staticConfig } = await import('@/config/static-config');

    expect(staticConfig.port).toBe(4321);
    expect(staticConfig.logLevel).toBe('debug');
  });

  it('falls back to default port when PORT is invalid', async () => {
    process.env.PORT = 'NaN';
    process.env.LOG_LEVEL = 'warn';

    const { staticConfig } = await import('@/config/static-config');

    expect(staticConfig.port).toBe(3000);
    expect(staticConfig.logLevel).toBe('warn');
  });

  it('falls back to default port when PORT is outside valid range', async () => {
    process.env.PORT = '70000';

    const { staticConfig } = await import('@/config/static-config');

    expect(staticConfig.port).toBe(3000);
  });
});
