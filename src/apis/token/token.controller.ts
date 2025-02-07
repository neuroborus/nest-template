import { Controller, Get, SerializeOptions, Param } from '@nestjs/common';
import { TokenService } from '@/services/token';
import { ApiResponse, ApiParam } from '@nestjs/swagger';
import { TokenData } from '@/entities/token';
import { TokenStatusDto } from './token-status.dto';

@Controller('token')
export class TokenController {
  constructor(private readonly token: TokenService) {}

  @Get('/:tokenAddress')
  @ApiResponse({ status: 200, type: TokenStatusDto })
  @SerializeOptions({ type: TokenStatusDto })
  @ApiParam({
    name: 'tokenAddress',
    required: true,
    description: 'Token Address',
    example: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  })
  getHealth(@Param('tokenAddress') tokenAddress: string): Promise<TokenData> {
    return this.token.getTokenStatus(tokenAddress);
  }
}
