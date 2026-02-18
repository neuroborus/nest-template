import { BadRequestException, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '@/guards/jwt-auth/jwt-auth.guard';
import { RequestStore } from '@/stores/request';

describe('JwtAuthGuard', () => {
  const jwt = {
    verifyAsync: jest.fn(),
  } as unknown as JwtService;

  const requestStorage = {
    setUserId: jest.fn(),
    setEthAddress: jest.fn(),
    setSessionId: jest.fn(),
  } as unknown as RequestStore;

  const guard = new JwtAuthGuard(jwt, requestStorage);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  function contextFor(headers: Record<string, string>): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ headers }),
      }),
    } as unknown as ExecutionContext;
  }

  it('returns true for valid bearer token and stores payload', async () => {
    (jwt.verifyAsync as jest.Mock).mockResolvedValue({
      sub: 'u1',
      ethAddress: '0xabc',
      sessionId: 's1',
    });

    await expect(
      guard.canActivate(contextFor({ authorization: 'Bearer token' })),
    ).resolves.toBe(true);
    expect(jwt.verifyAsync).toHaveBeenCalledWith('token');
    expect(requestStorage.setUserId).toHaveBeenCalledWith('u1', 'JwtAuthGuard');
    expect(requestStorage.setEthAddress).toHaveBeenCalledWith(
      '0xabc',
      'JwtAuthGuard',
    );
    expect(requestStorage.setSessionId).toHaveBeenCalledWith(
      's1',
      'JwtAuthGuard',
    );
  });

  it('returns false when token verification fails', async () => {
    (jwt.verifyAsync as jest.Mock).mockRejectedValue(new Error('bad token'));

    await expect(
      guard.canActivate(contextFor({ authorization: 'Bearer token' })),
    ).resolves.toBe(false);
  });

  it('throws bad request for invalid auth header format', async () => {
    await expect(
      guard.canActivate(contextFor({ authorization: 'Token something' })),
    ).rejects.toEqual(expect.any(BadRequestException));
  });

  it('throws bad request when authorization header is missing', async () => {
    await expect(guard.canActivate(contextFor({}))).rejects.toEqual(
      expect.any(BadRequestException),
    );
  });
});
