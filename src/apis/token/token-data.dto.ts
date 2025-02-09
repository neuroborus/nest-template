import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { TokenData } from '@/entities/token';

@Exclude()
export class TokenDataDto implements TokenData {
  @Expose()
  @IsString()
  @ApiProperty({
    type: String,
    example: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  })
  tokenAddress: string;

  @Expose()
  @IsString()
  @ApiProperty({ type: String, example: 'USDT' })
  symbol: string;

  @Expose()
  @IsString()
  @ApiProperty({ type: String, example: '6' })
  decimals: string;

  @Expose()
  @IsString()
  @ApiProperty({ type: String, example: '76922650752242969' })
  totalSupplyWei: string;

  @Expose()
  @IsString()
  @ApiProperty({ type: String, example: '76922650752.242969' })
  totalSupplyTokens: string;
}
