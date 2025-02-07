import { ethers } from 'ethers';

export interface Networks {
  rpcUrl: string;
  multicallAddress: string;
  provider?: ethers.JsonRpcProvider;
}
