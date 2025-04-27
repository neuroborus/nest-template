import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Address } from 'viem';
import { ClientData } from '@/entities/user';

const notFoundErr = (valueName: string) =>
  new Error(`Not Found In RequestStore: ${valueName}`);

@Injectable({ scope: Scope.REQUEST })
export class RequestStore {
  private _ethAddress?: Address;
  private _sessionId?: string;
  private _clientData?: ClientData;

  constructor(@Inject(REQUEST) private readonly request: Request) {}

  setEthAddress(ethAddress: Address, accessName: string) {
    if (accessName === 'JwtAuthGuard') this._ethAddress = ethAddress;
  }
  setSessionId(sessionId: string, accessName: string) {
    if (accessName === 'JwtAuthGuard') this._sessionId = sessionId;
  }
  setClientData(clientData: ClientData, accessName: string) {
    if (accessName === 'ClientInfoInterceptor') this._clientData = clientData;
  }

  get ethAddress(): Address {
    const ethAddress = this._ethAddress;
    if (!ethAddress) throw notFoundErr('ethAddress');
    return ethAddress;
  }
  get sessionId(): string {
    const sessionId = this._sessionId;
    if (!sessionId) throw notFoundErr('sessionId');
    return sessionId;
  }
  get clientData(): ClientData {
    const clientData = this._clientData;
    if (!clientData) throw notFoundErr('clientData');
    return this._clientData;
  }
}
