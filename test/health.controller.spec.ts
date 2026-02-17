import { HealthController } from '@/apis/health';
import { HealthStatus } from '@/entities/health';
import { HealthService } from '@/services/health';

describe('HealthController', () => {
  it('returns value from health service', () => {
    const response: HealthStatus = { status: 'OK', port: 3000, logLevel: 'info' };
    const check = jest.fn().mockReturnValue(response);
    const healthService = { check } as unknown as HealthService;

    const controller = new HealthController(healthService);

    expect(controller.getHealth()).toBe(response);
    expect(check).toHaveBeenCalledTimes(1);
  });
});
