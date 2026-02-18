import { AuthFeature } from '@/features/auth/auth.feature';
import { RequestStore } from '@/stores/request';
import { NonceService } from '@/services/nonce';
import { SessionService } from '@/services/session';

describe('AuthFeature', () => {
  const request = {
    clientData: {
      ipAddress: '127.0.0.1',
      userAgent: 'jest',
    },
    sessionId: 's1',
    ethAddress: '0xabc',
  } as unknown as RequestStore;

  const nonce = {
    create: jest.fn(),
    validate: jest.fn(),
  } as unknown as NonceService;

  const session = {
    create: jest.fn(),
    refresh: jest.fn(),
    deleteSession: jest.fn(),
  } as unknown as SessionService;

  const logger = { trace: jest.fn() };

  const feature = new AuthFeature(request, nonce, session, logger as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates nonce', async () => {
    (nonce.create as jest.Mock).mockResolvedValue('nonce');

    await expect(feature.createNonce('0xabc')).resolves.toEqual({
      nonce: 'nonce',
    });
    expect(nonce.create).toHaveBeenCalledWith('0xabc');
  });

  it('creates session after nonce validation', async () => {
    (session.create as jest.Mock).mockResolvedValue({
      accessToken: 'a',
      refreshToken: 'r',
    });

    await expect(feature.createSession('0xabc', 'sig')).resolves.toEqual({
      accessToken: 'a',
      refreshToken: 'r',
    });
    expect(nonce.validate).toHaveBeenCalledWith('0xabc', 'sig');
    expect(session.create).toHaveBeenCalledWith('0xabc', '127.0.0.1', 'jest');
  });

  it('refreshes session with current client data', async () => {
    (session.refresh as jest.Mock).mockResolvedValue({
      ethAddress: '0xabc',
      loginData: { accessToken: 'next' },
    });

    await expect(feature.refreshSession('rt')).resolves.toEqual({
      accessToken: 'next',
    });
    expect(session.refresh).toHaveBeenCalledWith('127.0.0.1', 'jest', 'rt');
  });

  it('deletes session from request context', async () => {
    await expect(feature.deleteSession()).resolves.toBeUndefined();
    expect(session.deleteSession).toHaveBeenCalledWith('s1');
  });
});
