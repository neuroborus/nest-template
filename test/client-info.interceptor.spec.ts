import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { ClientInfoInterceptor } from '@/client-info.interceptor';
import { RequestStore } from '@/stores/request';

describe('ClientInfoInterceptor', () => {
  it('stores client info from request', async () => {
    const reqStorage = {
      setClientData: jest.fn(),
    } as unknown as RequestStore;

    const interceptor = new ClientInfoInterceptor(reqStorage);

    const request = {
      ip: '127.0.0.1',
      get: jest.fn().mockReturnValue('jest-agent'),
    };
    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext;
    const next = {
      handle: jest.fn().mockReturnValue(of('ok')),
    } as unknown as CallHandler;

    const result = await interceptor.intercept(context, next);

    expect(reqStorage.setClientData).toHaveBeenCalledWith(
      { ipAddress: '127.0.0.1', userAgent: 'jest-agent' },
      'ClientInfoInterceptor',
    );
    expect(next.handle).toHaveBeenCalledTimes(1);
    expect(result).toBeDefined();
  });

  it('uses unknown defaults when request values are absent', async () => {
    const reqStorage = {
      setClientData: jest.fn(),
    } as unknown as RequestStore;
    const interceptor = new ClientInfoInterceptor(reqStorage);

    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ get: jest.fn() }),
      }),
    } as unknown as ExecutionContext;
    const next = {
      handle: jest.fn().mockReturnValue(of('ok')),
    } as unknown as CallHandler;

    await interceptor.intercept(context, next);

    expect(reqStorage.setClientData).toHaveBeenCalledWith(
      { ipAddress: 'unknown', userAgent: 'unknown' },
      'ClientInfoInterceptor',
    );
  });
});
