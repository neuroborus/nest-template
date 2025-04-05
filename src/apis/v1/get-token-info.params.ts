import { IsEnum } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { Chain } from 'ethers-tools';
import { IsEthAddress } from 'ethers-tools-nestjs';

@Exclude()
export class GetTokenInfoParams {
  @Expose()
  @Type(() => Number)
  @IsEnum(Chain)
  chain: Chain;

  @Expose()
  @IsEthAddress()
  tokenAddress: string;
}
