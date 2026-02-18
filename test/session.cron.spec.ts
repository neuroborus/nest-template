import { SessionCron } from '@/services/session/session.cron';
import { SessionsStore } from '@/stores/sessions';

describe('SessionCron', () => {
  it('deletes expired sessions and logs count', async () => {
    const sessions = {
      deleteMany: jest.fn().mockResolvedValue(2),
    } as unknown as SessionsStore;
    const logger = { trace: jest.fn() };

    const cron = new SessionCron(sessions, logger as any);

    await expect(cron.clearExpired()).resolves.toBeUndefined();
    expect(sessions.deleteMany).toHaveBeenCalledWith({
      expiredBefore: expect.any(Date),
    });
    expect(logger.trace).toHaveBeenCalledWith(
      { deleted: 2 },
      'Expired sessions cleared',
    );
  });
});
