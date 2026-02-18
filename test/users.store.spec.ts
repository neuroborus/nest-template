import { ConfigService } from '@nestjs/config';
import { UsersStore } from '@/stores/users/users.store';

jest.mock('@/helpers/random', () => ({
  randomId: jest.fn(() => 'user-id'),
  randomAuthNonce: jest.fn(),
}));

describe('UsersStore', () => {
  const prisma = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
    $transaction: jest.fn(),
  } as any;
  const config = {} as ConfigService;
  const logger = { warn: jest.fn() };

  const store = new UsersStore(prisma, config, logger as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates user with lowercase address and random id', async () => {
    prisma.user.create.mockResolvedValue({
      id: 'user-id',
      ethAddress: '0xabc',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(store.create('0xABC')).resolves.toEqual(
      expect.objectContaining({
        id: 'user-id',
        ethAddress: '0xabc',
      }),
    );
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        id: 'user-id',
        ethAddress: '0xabc',
      },
    });
  });

  it('gets user by lowercase address', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'u1',
      ethAddress: '0xabc',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(store.get('0xABC')).resolves.toEqual(
      expect.objectContaining({
        id: 'u1',
        ethAddress: '0xabc',
      }),
    );
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { ethAddress: '0xabc' },
    });
  });
});
