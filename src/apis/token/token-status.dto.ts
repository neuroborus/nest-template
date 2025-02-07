import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { TokenData } from '@/entities/token';

@Exclude()
export class TokenStatusDto implements TokenData {
  @Expose()
  @IsString()
  @ApiProperty({ type: String, example: 'https://eth.llamarpc.com' })
  rpcUrl: string;

  @Expose()
  @IsString()
  @ApiProperty({ type: String, example: 'USDT' })
  symbol: string;

  @Expose()
  @IsNumber()
  @ApiProperty({ type: Number, example: 6 })
  decimals: number;

  @Expose()
  @IsString()
  @ApiProperty({ type: String, example: '76922650752242969' })
  totalSupplyWei: string;

  @Expose()
  @IsString()
  @ApiProperty({ type: String, example: '76922650752.242969' })
  totalSupplyTokens: string;
}
