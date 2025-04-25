import { Address } from 'viem';

export interface AuthNonce {
  id: string;
  createdAt: Date;
  //
  expired: Date;
  ethAddress: Address;
  nonce: string;
}
