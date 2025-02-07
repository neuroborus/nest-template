import { Controller, Get, SerializeOptions, Headers } from '@nestjs/common';
import { TokenService } from '@/services/token';
import { ApiResponse, ApiHeader} from '@nestjs/swagger';
import { TokenStatus } from '@/entities/token';
import { TokenStatusDto } from '@/apis/token/token-status.dto';

@Controller('token')
export class TokenController {
  constructor(private readonly token: TokenService) {}

  @Get()
  @ApiResponse({ status: 200, type: TokenStatusDto })
  @SerializeOptions({ type: TokenStatusDto })
  @ApiHeader({ name: 'token-address', required: true, description: 'Token Address' })
  getHealth(@Headers('token-address') tokenAddress: string): Promise<TokenStatus> {
    return this.token.getTokenStatus(tokenAddress);
  }
}
