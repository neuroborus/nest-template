import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenData } from '@/entities/token';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { erc20Abi, multicallAbi } from '@/abis';

@Injectable()
export class TokenService {
  private contractInterface: ethers.Interface;
  private readonly logger = new Logger(TokenService.name);

  constructor(private readonly config: ConfigService) {
    this.contractInterface = new ethers.Interface(erc20Abi);
  }

  private unpackMulticall(
    returnData: ethers.BytesLike,
    functionName: string,
  ): string {
    return this.contractInterface
      .decodeFunctionResult(functionName, returnData)[0]
      .toString();
  }

  private weiToToken(wei: string, decimals: string): string {
    const weiBigN: BigNumber = new BigNumber(wei);
    const decimalsNum: number = Number(decimals);
    return weiBigN
      .dividedBy(new BigNumber(10).pow(decimalsNum))
      .toFixed(decimalsNum);
  }

  private async fetchTokenData(tokenAddress: string) {
    try {
      const multicall = new ethers.Contract(
        this.config.getOrThrow('multicallAddress'),
        multicallAbi,
        new ethers.JsonRpcProvider(this.config.getOrThrow('rpcUrl')),
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

      const decimals: string = this.unpackMulticall(returnData[1], 'decimals');
      const totalSupplyWei: string = this.unpackMulticall(
        returnData[2],
        'totalSupply',
      );

      return {
        tokenAddress: tokenAddress,
        symbol: this.unpackMulticall(returnData[0], 'symbol'),
        decimals: decimals,
        totalSupplyWei: totalSupplyWei,
        totalSupplyTokens: this.weiToToken(totalSupplyWei, decimals),
      };
    } catch (error) {
      this.logger.error(`Error fetching token data: ${error.message}`);
      throw new Error(`Error fetching token data: ${error.message}`);
    }
  }

  public getTokenStatus(tokenAddress: string): Promise<TokenData> {
    if (!tokenAddress) {
      throw new Error(`Missing token address`);
    }
    return this.fetchTokenData(tokenAddress);
  }
}
