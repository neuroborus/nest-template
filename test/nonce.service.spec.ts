import { HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SiweMessage } from 'siwe';
import { NonceService } from '@/services/nonce/nonce.service';
import { AuthNoncesStore } from '@/stores/auth-nonces';

jest.mock('siwe', () => ({
  SiweMessage: jest.fn(),
  generateNonce: jest.fn(() => 'n-0S8QX8v2jQL3J4'),
}));

describe('NonceService', () => {
  const config = {
    getOrThrow: jest.fn().mockImplementation((key: string) => {
      if (key === 'auth.siweDomain') return 'localhost:3000';
      if (key === 'auth.siweUri') return 'http://localhost:3000';
      if (key === 'auth.siweAllowedChainIds') return [1];
      if (key === 'auth.siweIssuedAtTtlMs') return 300_000;
      if (key === 'auth.siweClockSkewMs') return 30_000;
      throw new Error(`Unknown key: ${key}`);
    }),
  } as unknown as ConfigService;

  const nonces = {
    get: jest.fn(),
    consume: jest.fn(),
    create: jest.fn(),
  } as unknown as AuthNoncesStore;

  const service = new NonceService(config, nonces);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setupSiwe = (
    overrides: Partial<{
      domain: string;
      address: string;
      uri: string;
      version: string;
      chainId: number;
      nonce: string;
      issuedAt: string;
      verifySuccess: boolean;
    }> = {},
  ) => {
    const verify = jest.fn().mockResolvedValue({
      success: overrides.verifySuccess ?? true,
    });

    (SiweMessage as unknown as jest.Mock).mockImplementation(() => ({
      domain: overrides.domain ?? 'localhost:3000',
      address:
        overrides.address ?? '0xd0e4a05a84ce039be8647ca8089266117a7e96c5',
      uri: overrides.uri ?? 'http://localhost:3000',
      version: overrides.version ?? '1',
      chainId: overrides.chainId ?? 1,
      nonce: overrides.nonce ?? 'nonce-1ABCD234',
      issuedAt: overrides.issuedAt ?? new Date().toISOString(),
      verify,
    }));

    return { verify };
  };

  it('creates nonce and returns expiration', async () => {
    const expiresAt = new Date('2026-01-01T00:00:00.000Z');
    (nonces.create as jest.Mock).mockResolvedValue({
      nonce: 'nonce-1ABCD234',
      expiresAt,
    });

    await expect(service.create()).resolves.toEqual({
      nonce: 'nonce-1ABCD234',
      expiresAt,
    });
  });

  it('rejects verification on domain mismatch', async () => {
    setupSiwe({ domain: 'evil.example' });

    await expect(service.validateSiwe('message', '0xsig')).rejects.toEqual(
      expect.objectContaining({ status: 401 }) as HttpException,
    );
  });

  it('rejects verification on uri mismatch', async () => {
    setupSiwe({ uri: 'https://evil.example/login' });

    await expect(service.validateSiwe('message', '0xsig')).rejects.toEqual(
      expect.objectContaining({ status: 401 }) as HttpException,
    );
  });

  it('rejects expired nonce', async () => {
    setupSiwe();
    (nonces.get as jest.Mock).mockResolvedValue({
      nonce: 'nonce-1ABCD234',
      expiresAt: new Date(Date.now() - 1_000),
      usedAt: null,
    });

    await expect(service.validateSiwe('message', '0xsig')).rejects.toEqual(
      expect.objectContaining({ status: 401 }) as HttpException,
    );
    expect(nonces.consume).not.toHaveBeenCalled();
  });

  it('rejects invalid signature', async () => {
    const { verify } = setupSiwe({ verifySuccess: false });
    (nonces.get as jest.Mock).mockResolvedValue({
      nonce: 'nonce-1ABCD234',
      expiresAt: new Date(Date.now() + 30_000),
      usedAt: null,
    });

    await expect(service.validateSiwe('message', '0xsig')).rejects.toEqual(
      expect.objectContaining({ status: 401 }) as HttpException,
    );
    expect(verify).toHaveBeenCalled();
    expect(nonces.consume).not.toHaveBeenCalled();
  });

  it('rejects nonce reuse when consume fails', async () => {
    setupSiwe();
    (nonces.get as jest.Mock).mockResolvedValue({
      nonce: 'nonce-1ABCD234',
      expiresAt: new Date(Date.now() + 30_000),
      usedAt: null,
    });
    (nonces.consume as jest.Mock).mockResolvedValue(false);

    await expect(service.validateSiwe('message', '0xsig')).rejects.toEqual(
      expect.objectContaining({ status: 401 }) as HttpException,
    );
  });

  it('allows exactly one concurrent verification attempt', async () => {
    setupSiwe();
    (nonces.get as jest.Mock).mockResolvedValue({
      nonce: 'nonce-1ABCD234',
      expiresAt: new Date(Date.now() + 30_000),
      usedAt: null,
    });

    let consumeCalls = 0;
    (nonces.consume as jest.Mock).mockImplementation(async () => {
      consumeCalls += 1;
      return consumeCalls === 1;
    });

    const [first, second] = await Promise.allSettled([
      service.validateSiwe('message', '0xsig'),
      service.validateSiwe('message', '0xsig'),
    ]);

    expect(first.status).not.toBe(second.status);
    expect([first.status, second.status].sort()).toEqual([
      'fulfilled',
      'rejected',
    ]);
  });
});
