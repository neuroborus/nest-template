import { HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthController } from '@/apis/v1/auth/auth.controller';
import { RequestStore } from '@/stores/request';
import { AuthFeature } from '@/features/auth';

describe('AuthController', () => {
  const requestStore = {
    ethAddress: '0xabc',
  } as unknown as RequestStore;

  const auth = {
    createNonce: jest.fn(),
    createSession: jest.fn(),
    deleteSession: jest.fn(),
    refreshSession: jest.fn(),
  } as unknown as AuthFeature;

  const controller = new AuthController(auth, requestStore);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates nonce', async () => {
    (auth.createNonce as jest.Mock).mockResolvedValue({ nonce: 'n1' });

    await expect(
      controller.createNonce({ ethAddress: '0xabc' }),
    ).resolves.toEqual({ nonce: 'n1' });
    expect(auth.createNonce).toHaveBeenCalledWith('0xabc');
  });

  it('logs in and sets refresh cookie', async () => {
    const res = { cookie: jest.fn() } as unknown as Response;
    (auth.createSession as jest.Mock).mockResolvedValue({
      accessToken: 'a',
      refreshToken: 'r',
      accessExpireMs: 1,
      refreshExpireMs: 2,
    });

    await expect(
      controller.login({ ethAddress: '0xabc', signedNonce: 'sig' }, res),
    ).resolves.toEqual({
      accessToken: 'a',
      refreshToken: 'r',
      accessExpireMs: 1,
      refreshExpireMs: 2,
    });
    expect(auth.createSession).toHaveBeenCalledWith('0xabc', 'sig');
    expect(res.cookie).toHaveBeenCalledWith(
      'refreshToken',
      'r',
      expect.objectContaining({
        httpOnly: true,
        secure: false,
        maxAge: 2,
      }),
    );
  });

  it('logs out and clears cookie', async () => {
    const res = { clearCookie: jest.fn() } as unknown as Response;

    await expect(controller.logout(res)).resolves.toBeUndefined();
    expect(auth.deleteSession).toHaveBeenCalledTimes(1);
    expect(res.clearCookie).toHaveBeenCalledWith(
      'refreshToken',
      expect.objectContaining({
        httpOnly: true,
      }),
    );
  });

  it('refreshes tokens from cookie', async () => {
    const req = { cookies: { refreshToken: 'rt' } } as unknown as Request;
    const res = { cookie: jest.fn() } as unknown as Response;
    (auth.refreshSession as jest.Mock).mockResolvedValue({
      accessToken: 'a2',
      refreshToken: 'r2',
      accessExpireMs: 10,
      refreshExpireMs: 20,
    });

    await expect(controller.refresh(req, res)).resolves.toEqual({
      accessToken: 'a2',
      refreshToken: 'r2',
      accessExpireMs: 10,
      refreshExpireMs: 20,
    });
    expect(auth.refreshSession).toHaveBeenCalledWith('rt');
    expect(res.cookie).toHaveBeenCalled();
  });

  it('throws when refresh token cookie is missing', async () => {
    const req = { cookies: {} } as unknown as Request;
    const res = { cookie: jest.fn() } as unknown as Response;

    await expect(controller.refresh(req, res)).rejects.toEqual(
      expect.objectContaining({
        status: 401,
      }) as HttpException,
    );
  });

  it('returns authenticated access address', () => {
    expect(controller.testAccess()).toBe('0xabc');
  });
});
