import { HealthController } from '@/apis/health';

describe('HealthController', () => {
  it('returns OK', () => {
    const controller = new HealthController();

    expect(controller.getHealth()).toBe('OK');
  });
});
