import { Test, TestingModule } from '@nestjs/testing';

import { HealthController } from '@/apis/health';
import { ConfigModule } from '@/config';
import { HealthService } from '@/services/health';

describe('HealthController', () => {
  let appController: HealthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [HealthController],
      providers: [HealthService],
    }).compile();

    appController = app.get<HealthController>(HealthController);
  });

  describe('health', () => {
    it('should return "OK"', () => {
      const health = appController.getHealth();
      expect(health.status).toBe('OK');
    });
  });
});
