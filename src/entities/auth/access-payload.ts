import { Address } from 'viem';

export interface AccessPayload {
  sub: string; // userId
  ethAddress: Address;
  sessionId: string;
}
