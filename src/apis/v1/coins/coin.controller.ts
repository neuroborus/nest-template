import {
  Controller,
  Get,
  Param,
  Query,
  SerializeOptions,
} from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { activeChains } from '@/config';
import { CoinInfo } from '@/entities/coin';
import { CoinService } from '@/services/coin';
import { CoinInfoDto } from './coin-info.dto';
import { GetTokenInfoParams } from '../get-token-info.params';
import { GetCoinInfoQuery } from './get-coin-info.query';

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
    description: 'User address',
    required: false,
  })
  @ApiResponse({ status: 200, type: CoinInfoDto })
  @SerializeOptions({ type: CoinInfoDto })
  getCoinInfo(
    @Param() params: GetTokenInfoParams,
    @Query() query: GetCoinInfoQuery,
  ): Promise<CoinInfo> {
    return this.token.getCoinInfo(
      params.chain,
      params.tokenAddress,
      query.userAddress,
    );
  }
}
