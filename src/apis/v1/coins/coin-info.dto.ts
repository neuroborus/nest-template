import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { CoinInfo } from '@/entities/coin';

@Exclude()
export class CoinInfoDto implements CoinInfo {
  @Expose()
  @IsString()
  @ApiProperty({ type: String, example: 'Tether USD' })
  name: string;

  @Expose()
  @IsString()
  @ApiProperty({ type: String, example: 'USDT' })
  symbol: string;

  @Expose()
  @IsString()
  @ApiProperty({ type: String, example: '75891699896901975' })
  totalSupply: string;

  @Expose()
  @IsNumber()
  @ApiProperty({ type: Number, example: 6 })
  decimals: number;

  @Expose()
  @IsString()
  @ApiProperty({ type: String, example: '75891699896' })
  balances: string;
}
