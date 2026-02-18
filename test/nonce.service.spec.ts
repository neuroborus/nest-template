import { HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verifyMessage } from 'viem';
import { NonceService } from '@/services/nonce/nonce.service';
import { AuthNoncesStore } from '@/stores/auth-nonces';

jest.mock('viem', () => ({
  ...jest.requireActual('viem'),
  verifyMessage: jest.fn(),
}));

describe('NonceService', () => {
  const config = {
    getOrThrow: jest.fn().mockImplementation((key: string) => {
      if (key === 'auth.authNonceCreationDelayMs') return 60_000;
      throw new Error(`Unknown key: ${key}`);
    }),
  } as unknown as ConfigService;

  const nonces = {
    get: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
  } as unknown as AuthNoncesStore;

  const service = new NonceService(config, nonces);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates nonce when none exists', async () => {
    (nonces.get as jest.Mock).mockResolvedValue(null);
    (nonces.create as jest.Mock).mockResolvedValue({ nonce: 'n1' });

    await expect(service.create('0xabc')).resolves.toBe('n1');
    expect(nonces.create).toHaveBeenCalledWith('0xabc');
  });

  it('blocks nonce recreation during delay window', async () => {
    (nonces.get as jest.Mock).mockResolvedValue({
      createdAt: new Date(Date.now() - 1_000),
    });

    await expect(service.create('0xabc')).rejects.toEqual(
      expect.objectContaining({
        status: 401,
      }) as HttpException,
    );
    expect(nonces.delete).not.toHaveBeenCalled();
  });

  it('replaces stale nonce outside delay window', async () => {
    (nonces.get as jest.Mock).mockResolvedValue({
      createdAt: new Date(Date.now() - 61_000),
    });
    (nonces.create as jest.Mock).mockResolvedValue({ nonce: 'n2' });

    await expect(service.create('0xabc')).resolves.toBe('n2');
    expect(nonces.delete).toHaveBeenCalledWith('0xabc');
    expect(nonces.create).toHaveBeenCalledWith('0xabc');
  });

  it('rejects validation if nonce is missing', async () => {
    (nonces.get as jest.Mock).mockResolvedValue(null);

    await expect(service.validate('0xabc', 'sig')).rejects.toEqual(
      expect.objectContaining({
        status: 401,
      }) as HttpException,
    );
  });

  it('rejects validation on wrong signature', async () => {
    (nonces.get as jest.Mock).mockResolvedValue({ nonce: 'n' });
    (verifyMessage as jest.Mock).mockResolvedValue(false);

    await expect(service.validate('0xabc', 'sig')).rejects.toEqual(
      expect.objectContaining({
        status: 401,
      }) as HttpException,
    );
    expect(nonces.delete).not.toHaveBeenCalled();
  });

  it('deletes nonce after successful signature validation', async () => {
    (nonces.get as jest.Mock).mockResolvedValue({ nonce: 'n' });
    (verifyMessage as jest.Mock).mockResolvedValue(true);

    await expect(service.validate('0xabc', 'sig')).resolves.toBeUndefined();
    expect(nonces.delete).toHaveBeenCalledWith('0xabc');
  });
});
