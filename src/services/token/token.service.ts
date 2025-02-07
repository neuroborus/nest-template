import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenData } from '@/entities/token';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { abi } from '@/abis';
import { Networks } from './networks';

@Injectable()
export class TokenService {
  private networks: Networks;
  private contractInterface: ethers.Interface;

  constructor(private readonly config: ConfigService) {
    this.networks = {
      rpcUrl: this.config.getOrThrow('rpcUrl') || '',
      multicallAddress: this.config.getOrThrow('multicallAddress') || '',
    };

    this.contractInterface = new ethers.Interface(abi);
  }

  private async fetchTokenData(network: Networks, tokenAddress: string) {
    if (!tokenAddress || !network.rpcUrl || !network.multicallAddress) {
      throw new Error(`Missing configuration for network: ${network.rpcUrl}`);
    }

    network.provider = new ethers.JsonRpcProvider(network.rpcUrl);

    const multicall = new ethers.Contract(
      network.multicallAddress,
      [
        'function aggregate(tuple(address target, bytes callData)[] calls) view returns (uint256 blockNumber, bytes[] returnData)',
      ],
      network.provider,
    );

    const calls = [
      {
        target: tokenAddress,
        callData: this.contractInterface.encodeFunctionData('symbol'),
      },
      {
        target: tokenAddress,
        callData: this.contractInterface.encodeFunctionData('decimals'),
      },
      {
        target: tokenAddress,
        callData: this.contractInterface.encodeFunctionData('totalSupply'),
      },
    ];

    const [, returnData] = await multicall.aggregate(calls);

    const decimals: number = Number(
      this.contractInterface.decodeFunctionResult('decimals', returnData[1])[0],
    );
    const totalSupplyWei: string = this.contractInterface
      .decodeFunctionResult('totalSupply', returnData[2])[0]
      .toString();
    const totalSupplyWeiBigN: BigNumber = new BigNumber(totalSupplyWei);

    return {
      rpcUrl: network.rpcUrl,
      symbol: this.contractInterface.decodeFunctionResult(
        'symbol',
        returnData[0],
      )[0],
      decimals: decimals,
      totalSupplyWei: totalSupplyWei,
      totalSupplyTokens: totalSupplyWeiBigN
        .dividedBy(new BigNumber(10).pow(decimals))
        .toFixed(decimals),
    };
  }

  public async getTokenStatus(tokenAddress: string): Promise<TokenData> {
    try {
      return await this.fetchTokenData(this.networks, tokenAddress);
    } catch (error) {
      console.error('Error fetching token data:', error);
      throw error;
    }
  }
}
