import { HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SessionService } from '@/services/session/session.service';
import { UsersStore } from '@/stores/users';
import { SessionsStore } from '@/stores/sessions';

jest.mock('@/helpers/random', () => ({
  randomId: jest.fn(() => 'session-id'),
  randomAuthNonce: jest.fn(),
}));

describe('SessionService', () => {
  const config = {
    getOrThrow: jest.fn().mockImplementation((key: string) => {
      if (key === 'auth.refreshTokenTtlMs') return 300_000;
      if (key === 'auth.accessTokenTtlMs') return 60_000;
      if (key === 'auth.refreshSecret') return 'refresh-secret';
      throw new Error(`Unknown key: ${key}`);
    }),
  } as unknown as ConfigService;

  const users = {
    get: jest.fn(),
    create: jest.fn(),
  } as unknown as UsersStore;

  const sessions = {
    upsert: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
  } as unknown as SessionsStore;

  const jwt = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  } as unknown as JwtService;

  const service = new SessionService(config, users, sessions, jwt);

  beforeEach(() => {
    jest.clearAllMocks();
    (jwt.signAsync as jest.Mock)
      .mockResolvedValueOnce('access-token')
      .mockResolvedValueOnce('refresh-token');
  });

  it('creates user when missing and upserts session', async () => {
    (users.get as jest.Mock).mockResolvedValue(null);
    (users.create as jest.Mock).mockResolvedValue({ id: 'u1' });

    const result = await service.create('0xabc', '127.0.0.1', 'ua');

    expect(result).toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      accessExpireMs: 60_000,
      refreshExpireMs: 300_000,
    });
    expect(users.create).toHaveBeenCalledWith('0xabc');
    expect(sessions.upsert).toHaveBeenCalledWith(
      'session-id',
      { userId: 'u1', ipAddress: '127.0.0.1', userAgent: 'ua' },
      expect.stringMatching(/^[a-f0-9]{64}$/),
    );
  });

  it('reuses existing user when present', async () => {
    (users.get as jest.Mock).mockResolvedValue({ id: 'u1' });

    await service.create('0xabc', 'ip', 'ua');

    expect(users.create).not.toHaveBeenCalled();
  });

  it('rejects refresh when token verification fails', async () => {
    (jwt.verifyAsync as jest.Mock).mockRejectedValue(new Error('bad token'));

    await expect(service.refresh('ip', 'ua', 'rt')).rejects.toEqual(
      expect.objectContaining({
        status: 401,
      }) as HttpException,
    );
  });

  it('rejects refresh when session is missing', async () => {
    (jwt.verifyAsync as jest.Mock).mockResolvedValue({
      sub: 'u1',
      ethAddress: '0xabc',
      sessionId: 's1',
    });
    (sessions.get as jest.Mock).mockResolvedValue(null);

    await expect(service.refresh('ip', 'ua', 'rt')).rejects.toEqual(
      expect.objectContaining({
        status: 401,
      }) as HttpException,
    );
  });

  it('deletes expired session and rejects refresh', async () => {
    (jwt.verifyAsync as jest.Mock).mockResolvedValue({
      sub: 'u1',
      ethAddress: '0xabc',
      sessionId: 's1',
    });
    (sessions.get as jest.Mock).mockResolvedValue({
      id: 's1',
      expired: new Date(Date.now() - 1),
      refreshTokenHash: 'x',
    });

    await expect(service.refresh('ip', 'ua', 'rt')).rejects.toEqual(
      expect.objectContaining({
        status: 401,
      }) as HttpException,
    );
    expect(sessions.delete).toHaveBeenCalledWith('s1');
  });

  it('deletes session on token hash mismatch and rejects refresh', async () => {
    (jwt.verifyAsync as jest.Mock).mockResolvedValue({
      sub: 'u1',
      ethAddress: '0xabc',
      sessionId: 's1',
    });
    (sessions.get as jest.Mock).mockResolvedValue({
      id: 's1',
      expired: new Date(Date.now() + 1_000),
      refreshTokenHash: 'different-hash',
    });

    await expect(service.refresh('ip', 'ua', 'rt')).rejects.toEqual(
      expect.objectContaining({
        status: 401,
      }) as HttpException,
    );
    expect(sessions.delete).toHaveBeenCalledWith('s1');
  });

  it('refreshes valid session and rotates refresh token hash', async () => {
    (jwt.verifyAsync as jest.Mock).mockResolvedValue({
      sub: 'u1',
      ethAddress: '0xabc',
      sessionId: 's1',
    });
    (sessions.get as jest.Mock).mockResolvedValue({
      id: 's1',
      expired: new Date(Date.now() + 1_000),
      refreshTokenHash:
        'cdffd5dd8ca8126c0482ba994814b9014cc9e973435d399f1cf1f69479e6b907',
    });
    (jwt.signAsync as jest.Mock).mockReset();
    (jwt.signAsync as jest.Mock)
      .mockResolvedValueOnce('new-access')
      .mockResolvedValueOnce('new-refresh');

    await expect(service.refresh('ip', 'ua', 'rt')).resolves.toEqual({
      ethAddress: '0xabc',
      loginData: {
        accessToken: 'new-access',
        refreshToken: 'new-refresh',
        accessExpireMs: 60_000,
        refreshExpireMs: 300_000,
      },
    });
    expect(sessions.upsert).toHaveBeenCalledWith(
      's1',
      { userId: 'u1', ipAddress: 'ip', userAgent: 'ua' },
      expect.stringMatching(/^[a-f0-9]{64}$/),
    );
  });

  it('deletes session by id', async () => {
    await expect(service.deleteSession('s1')).resolves.toBeUndefined();
    expect(sessions.delete).toHaveBeenCalledWith('s1');
  });
});
