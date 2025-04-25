import { Address } from 'viem';

export interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  ethAddress: Address;
}
