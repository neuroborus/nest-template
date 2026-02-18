import { NonceCron } from '@/services/nonce/nonce.cron';
import { AuthNoncesStore } from '@/stores/auth-nonces';

describe('NonceCron', () => {
  it('deletes expired nonces and logs count', async () => {
    const nonces = {
      deleteMany: jest.fn().mockResolvedValue(3),
    } as unknown as AuthNoncesStore;
    const logger = { trace: jest.fn() };

    const cron = new NonceCron(nonces, logger as any);

    await expect(cron.clearExpired()).resolves.toBeUndefined();
    expect(nonces.deleteMany).toHaveBeenCalledWith({
      expiredBefore: expect.any(Date),
    });
    expect(logger.trace).toHaveBeenCalledWith(
      { deleted: 3 },
      'Expired auth-nonces cleared',
    );
  });
});
