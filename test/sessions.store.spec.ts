import { ConfigService } from '@nestjs/config';
import { SessionsStore } from '@/stores/sessions/sessions.store';

describe('SessionsStore', () => {
  const config = {
    getOrThrow: jest.fn().mockReturnValue(120_000),
  } as unknown as ConfigService;
  const logger = { warn: jest.fn() };
  const prisma = {
    session: {
      upsert: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    $transaction: jest.fn(),
  } as any;

  const store = new SessionsStore(prisma, config, logger as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('upserts session by target tuple', async () => {
    prisma.session.upsert.mockResolvedValue({ id: 's1' });

    await expect(
      store.upsert(
        's1',
        { userId: 'u1', ipAddress: '127.0.0.1', userAgent: 'ua' },
        'hash',
      ),
    ).resolves.toEqual({ id: 's1' });
    expect(prisma.session.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          id: 's1',
          refreshTokenHash: 'hash',
        }),
        update: expect.objectContaining({
          id: 's1',
          refreshTokenHash: 'hash',
        }),
        where: {
          target: {
            userId: 'u1',
            ipAddress: '127.0.0.1',
            userAgent: 'ua',
          },
        },
      }),
    );
  });

  it('gets and deletes session by id', async () => {
    prisma.session.findUnique.mockResolvedValue({ id: 's1' });
    prisma.session.delete.mockResolvedValue({ id: 's1' });

    await expect(store.get('s1')).resolves.toEqual({ id: 's1' });
    await expect(store.delete('s1')).resolves.toEqual({ id: 's1' });
  });

  it('deletes many with optional expiry filter', async () => {
    prisma.session.deleteMany.mockResolvedValue({ count: 5 });

    await expect(store.deleteMany()).resolves.toBe(5);
    expect(prisma.session.deleteMany).toHaveBeenCalledWith({});

    const expiredBefore = new Date();
    await expect(store.deleteMany({ expiredBefore })).resolves.toBe(5);
    expect(prisma.session.deleteMany).toHaveBeenCalledWith({
      where: { expired: { lt: expiredBefore } },
    });
  });
});
