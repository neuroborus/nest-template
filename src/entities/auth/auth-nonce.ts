import { ModelData } from '../model-data';

export interface AuthNonceData {
  expiresAt: Date;
  usedAt: Date | null;
  usedByAddress: string | null;
  nonce: string;
}

export type AuthNonce = AuthNonceData & Omit<ModelData, 'updatedAt'>;
