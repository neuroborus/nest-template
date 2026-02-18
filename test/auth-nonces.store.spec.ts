import { ConfigService } from '@nestjs/config';
import { AuthNoncesStore } from '@/stores/auth-nonces/auth-nonces.store';

jest.mock('@/helpers/random', () => ({
  randomId: jest.fn(() => 'nonce-id'),
  randomAuthNonce: jest.fn(() => 'nonce-value'),
}));

describe('AuthNoncesStore', () => {
  const config = {
    getOrThrow: jest.fn().mockReturnValue(60_000),
  } as unknown as ConfigService;
  const logger = { warn: jest.fn() };
  const prisma = {
    authNonce: {
      create: jest.fn(),
      findUnique: jest.fn(),
      updateMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    $transaction: jest.fn(),
  } as any;

  const store = new AuthNoncesStore(prisma, config, logger as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates nonce with ttl-based expiration', async () => {
    prisma.authNonce.create.mockResolvedValue({
      id: 'nonce-id',
      nonce: 'nonce-value',
      expiresAt: new Date(),
      usedAt: null,
      usedByAddress: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(store.create()).resolves.toEqual(
      expect.objectContaining({
        id: 'nonce-id',
        nonce: 'nonce-value',
      }),
    );
  });

  it('gets nonce by nonce value', async () => {
    prisma.authNonce.findUnique.mockResolvedValue({
      id: 'n',
      nonce: 'v',
      expiresAt: new Date(),
      usedAt: null,
      usedByAddress: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(store.get('v')).resolves.toEqual(
      expect.objectContaining({ nonce: 'v' }),
    );
    expect(prisma.authNonce.findUnique).toHaveBeenCalledWith({
      where: { nonce: 'v' },
    });
  });

  it('consumes nonce atomically', async () => {
    prisma.authNonce.updateMany.mockResolvedValue({ count: 1 });

    await expect(store.consume('n1', '0xABC')).resolves.toBe(true);
    expect(prisma.authNonce.updateMany).toHaveBeenCalledWith({
      where: {
        nonce: 'n1',
        usedAt: null,
        expiresAt: {
          gt: expect.any(Date),
        },
      },
      data: {
        usedAt: expect.any(Date),
        usedByAddress: '0xabc',
      },
    });
  });

  it('deletes many with optional expiry filter', async () => {
    prisma.authNonce.deleteMany.mockResolvedValue({ count: 4 });

    await expect(store.deleteMany()).resolves.toBe(4);
    expect(prisma.authNonce.deleteMany).toHaveBeenCalledWith({});

    const expiresBefore = new Date();
    await expect(store.deleteMany({ expiresBefore })).resolves.toBe(4);
    expect(prisma.authNonce.deleteMany).toHaveBeenCalledWith({
      where: { expiresAt: { lt: expiresBefore } },
    });
  });
});
