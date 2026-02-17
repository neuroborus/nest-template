describe('configuration', () => {
  it('returns staticConfig object', async () => {
    const [{ configuration }, { staticConfig }] = await Promise.all([
      import('@/config/configuration'),
      import('@/config/static-config'),
    ]);

    expect(configuration()).toBe(staticConfig);
  });
});
