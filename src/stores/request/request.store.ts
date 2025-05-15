import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Address } from 'viem';
import { ClientData } from '@/entities/user';

const notFoundErr = (valueName: string) =>
  new Error(`Not Found In RequestStore: ${valueName}`);

enum Accessor {
  JwtAuthGuard = 'JwtAuthGuard',
  ClientInfoInterceptor = 'ClientInfoInterceptor',
}

@Injectable({ scope: Scope.REQUEST })
export class RequestStore {
  private _userId?: string;
  private _ethAddress?: Address;
  private _sessionId?: string;
  private _clientData?: ClientData;

  constructor(@Inject(REQUEST) private readonly request: Request) {}

  setUserId(userId: string, accessor: string) {
    if (accessor === Accessor.JwtAuthGuard) this._userId = userId;
  }
  setEthAddress(ethAddress: Address, accessor: string) {
    if (accessor === Accessor.JwtAuthGuard) this._ethAddress = ethAddress;
  }
  setSessionId(sessionId: string, accessor: string) {
    if (accessor === Accessor.JwtAuthGuard) this._sessionId = sessionId;
  }
  setClientData(clientData: ClientData, accessor: string) {
    if (accessor === Accessor.ClientInfoInterceptor)
      this._clientData = clientData;
  }

  get ethAddress(): Address {
    const ethAddress = this._ethAddress;
    if (!ethAddress) throw notFoundErr('ethAddress');
    return ethAddress;
  }
  get userId(): string {
    const userId = this._userId;
    if (!userId) throw notFoundErr('userId');
    return userId;
  }
  get sessionId(): string {
    const sessionId = this._sessionId;
    if (!sessionId) throw notFoundErr('sessionId');
    return sessionId;
  }
  get clientData(): ClientData {
    const clientData = this._clientData;
    if (!clientData) throw notFoundErr('clientData');
    return clientData;
  }
}
