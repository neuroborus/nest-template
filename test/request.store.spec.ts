import { RequestStore } from '@/stores/request/request.store';

describe('RequestStore', () => {
  let store: RequestStore;

  beforeEach(() => {
    store = new RequestStore({} as any);
  });

  it('persists values from trusted accessors only', () => {
    store.setUserId('u1', 'JwtAuthGuard');
    store.setEthAddress('0xabc', 'JwtAuthGuard');
    store.setSessionId('s1', 'JwtAuthGuard');
    store.setClientData(
      { ipAddress: '127.0.0.1', userAgent: 'ua' },
      'ClientInfoInterceptor',
    );

    expect(store.userId).toBe('u1');
    expect(store.ethAddress).toBe('0xabc');
    expect(store.sessionId).toBe('s1');
    expect(store.clientData).toEqual({
      ipAddress: '127.0.0.1',
      userAgent: 'ua',
    });
  });

  it('ignores writes from unknown accessors', () => {
    store.setUserId('u1', 'Other');
    store.setEthAddress('0xabc', 'Other');
    store.setSessionId('s1', 'Other');
    store.setClientData({ ipAddress: '1', userAgent: 'a' }, 'Other');

    expect(() => store.userId).toThrow('Not Found In RequestStore: userId');
    expect(() => store.ethAddress).toThrow(
      'Not Found In RequestStore: ethAddress',
    );
    expect(() => store.sessionId).toThrow(
      'Not Found In RequestStore: sessionId',
    );
    expect(() => store.clientData).toThrow(
      'Not Found In RequestStore: clientData',
    );
  });
});
