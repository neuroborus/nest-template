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
import { TokenInfo } from '@/entities/token';
import { TokenService } from '@/services/token';
import { TokenInfoDto } from './token-info.dto';

@Controller('v1/token')
export class TokenController {
  constructor(private readonly token: TokenService) {}

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
  @ApiResponse({ status: 200, type: TokenInfoDto })
  @SerializeOptions({ type: TokenInfoDto })
  getTokenInfo(
    @Param('chain') chain: Chain,
    @Param('tokenAddress') tokenAddress: string,
    @Query('userAddress') userAddress?: string,
  ): Promise<TokenInfo> {
    return this.token.getTokenInfo(chain, tokenAddress, userAddress);
  }
}
