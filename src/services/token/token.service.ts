import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenData } from '@/entities/token';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { erc20Abi, multicallAbi } from '@/abis';

@Injectable()
export class TokenService {
  private readonly contractInterface: ethers.Interface = new ethers.Interface(
    erc20Abi,
  );
  private readonly logger = new Logger(TokenService.name);

  constructor(private readonly config: ConfigService) {}

  private unpackMulticall(
    returnData: ethers.BytesLike[],
  ): Record<string, string> {
    return {
      symbol: this.contractInterface
        .decodeFunctionResult('symbol', returnData[0])[0]
        .toString(),
      decimals: this.contractInterface
        .decodeFunctionResult('decimals', returnData[1])[0]
        .toString(),
      totalSupplyWei: this.contractInterface
        .decodeFunctionResult('totalSupply', returnData[2])[0]
        .toString(),
    };
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

      const decodedData = this.unpackMulticall(returnData);

      return {
        tokenAddress: tokenAddress,
        symbol: decodedData.symbol,
        decimals: decodedData.decimals,
        totalSupplyWei: decodedData.totalSupplyWei,
        totalSupplyTokens: this.weiToToken(
          decodedData.totalSupplyWei,
          decodedData.decimals,
        ),
      };
    } catch (error) {
      const message = `Error fetching token data: ${error.message}`;
      this.logger.error(message);
      throw new Error(message);
    }
  }

  public getTokenData(tokenAddress: string): Promise<TokenData> {
    if (!tokenAddress) {
      throw new Error(`Missing token address`);
    }
    return this.fetchTokenData(tokenAddress);
  }
}
