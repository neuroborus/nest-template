import { Address } from 'viem';
import { ModelData } from '../model-data';

export interface AuthNonceData {
  expired: Date;
  ethAddress: Address;
  nonce: string;
}

export type AuthNonce = AuthNonceData & Omit<ModelData, 'updatedAt'>;
