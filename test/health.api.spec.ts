import { MODULE_METADATA } from '@nestjs/common/constants';
import { HealthApi, HealthController } from '@/apis/health';

describe('HealthApi', () => {
  it('registers HealthController', () => {
    const controllers = Reflect.getMetadata(
      MODULE_METADATA.CONTROLLERS,
      HealthApi,
    );

    expect(controllers).toEqual([HealthController]);
  });
});
