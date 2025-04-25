import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Address } from 'viem';
import { ClientData } from '@/entities/user';

@Injectable({ scope: Scope.REQUEST })
export class RequestStore {
  private _ethAddress: Address;
  private _clientData: ClientData;

  constructor(@Inject(REQUEST) private readonly request: Request) {}

  setEthAddress(ethAddress: Address, accessName: string) {
    if (accessName === 'JwtAuthGuard') this._ethAddress = ethAddress;
  }
  setClientData(clientData: ClientData, accessName: string) {
    if (accessName === 'ClientInfoInterceptor') this._clientData = clientData;
  }

  get ethAddress(): Address {
    return this._ethAddress;
  }
  get clientData(): ClientData {
    return this._clientData;
  }
}
