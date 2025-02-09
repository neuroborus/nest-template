import { Controller, Get, SerializeOptions, Param } from '@nestjs/common';
import { TokenService } from '@/services/token';
import { ApiResponse, ApiParam } from '@nestjs/swagger';
import { TokenData } from '@/entities/token';
import { TokenDataDto } from './token-data.dto';

@Controller('token')
export class TokenController {
  constructor(private readonly token: TokenService) {}

  @Get('/:tokenAddress')
  @ApiResponse({ status: 200, type: TokenDataDto })
  @SerializeOptions({ type: TokenDataDto })
  @ApiParam({
    name: 'tokenAddress',
    required: true,
    description: 'Token Address',
    example: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  })
  getTokenData(
    @Param('tokenAddress') tokenAddress: string,
  ): Promise<TokenData> {
    return this.token.getTokenData(tokenAddress);
  }
}
