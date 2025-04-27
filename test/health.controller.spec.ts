import { Test, TestingModule } from '@nestjs/testing';

import { HealthController } from '@/apis/health';

describe('HealthController', () => {
  let appController: HealthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    appController = app.get<HealthController>(HealthController);
  });

  describe('health', () => {
    it('should return "OK"', () => {
      const health = appController.getHealth();
      expect(health).toBe('OK');
    });
  });
});
