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
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    $transaction: jest.fn(),
  } as any;

  const store = new AuthNoncesStore(prisma, config, logger as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates nonce with lowercase address', async () => {
    prisma.authNonce.create.mockResolvedValue({
      id: 'nonce-id',
      nonce: 'nonce-value',
      ethAddress: '0xabc',
      expired: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(store.create('0xABC')).resolves.toEqual(
      expect.objectContaining({
        id: 'nonce-id',
        nonce: 'nonce-value',
        ethAddress: '0xabc',
      }),
    );
  });

  it('gets nonce by lowercase address', async () => {
    prisma.authNonce.findUnique.mockResolvedValue({
      id: 'n',
      nonce: 'v',
      ethAddress: '0xabc',
      expired: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(store.get('0xABC')).resolves.toEqual(
      expect.objectContaining({ ethAddress: '0xabc' }),
    );
    expect(prisma.authNonce.findUnique).toHaveBeenCalledWith({
      where: { ethAddress: '0xabc' },
    });
  });

  it('deletes nonce by lowercase address', async () => {
    prisma.authNonce.delete.mockResolvedValue({
      id: 'n',
      nonce: 'v',
      ethAddress: '0xabc',
      expired: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(store.delete('0xABC')).resolves.toEqual(
      expect.objectContaining({ ethAddress: '0xabc' }),
    );
    expect(prisma.authNonce.delete).toHaveBeenCalledWith({
      where: { ethAddress: '0xabc' },
    });
  });

  it('deletes many with optional expiry filter', async () => {
    prisma.authNonce.deleteMany.mockResolvedValue({ count: 4 });

    await expect(store.deleteMany()).resolves.toBe(4);
    expect(prisma.authNonce.deleteMany).toHaveBeenCalledWith({});

    const expiredBefore = new Date();
    await expect(store.deleteMany({ expiredBefore })).resolves.toBe(4);
    expect(prisma.authNonce.deleteMany).toHaveBeenCalledWith({
      where: { expired: { lt: expiredBefore } },
    });
  });
});
