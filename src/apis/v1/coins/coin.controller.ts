import {
  Controller,
  Get,
  Param,
  Query,
  SerializeOptions,
} from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Chain } from 'ethers-tools';
import { activeChains } from '@/config';
import { CoinInfo } from 'src/entities/coin';
import { CoinService } from 'src/services/coin';
import { CoinInfoDto } from './coin-info.dto';

@Controller('v1/coin')
export class CoinController {
  constructor(private readonly token: CoinService) {}

  @Get(':chain/:tokenAddress')
  @ApiParam({
    name: 'chain',
    enum: activeChains,
    description: 'Blockchain network',
    example: 1,
  })
  @ApiParam({
    name: 'tokenAddress',
    type: String,
    description: 'Token address',
    example: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  })
  @ApiQuery({
    name: 'userAddress',
    type: String,
    description: 'Token address',
    required: false,
  })
  @ApiResponse({ status: 200, type: CoinInfoDto })
  @SerializeOptions({ type: CoinInfoDto })
  getTokenInfo(
    @Param('chain') chain: Chain,
    @Param('tokenAddress') tokenAddress: string,
    @Query('userAddress') userAddress?: string,
  ): Promise<CoinInfo> {
    return this.token.getTokenInfo(chain, tokenAddress, userAddress);
  }
}
