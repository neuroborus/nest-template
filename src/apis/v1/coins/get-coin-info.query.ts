import { IsOptional } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { IsEthAddress } from 'ethers-tools-nestjs';

@Exclude()
export class GetCoinInfoQuery {
  @Expose()
  @IsOptional()
  @IsEthAddress({ message: 'Invalid user address' })
  userAddress?: string;
}
