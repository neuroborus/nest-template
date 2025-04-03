import { Contract, ContractCall } from 'ethers-tools';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Erc20Contract extends Contract {
  getNameCall(): ContractCall {
    return this.getCall('name');
  }
  getSymbolCall(): ContractCall {
    return this.getCall('symbol');
  }
  getTotalSupplyCall(): ContractCall {
    return this.getCall('totalSupply');
  }
  getDecimalsCall(): ContractCall {
    return this.getCall('decimals');
  }
  //
  getBalancesCall(address: string): ContractCall {
    return this.getCall('balances', [address]);
  }
}
