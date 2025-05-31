import { Address } from 'viem';
import { ModelData } from '../model-data';

export interface UserData {
  ethAddress: Address;
}

export type User = UserData & ModelData;
