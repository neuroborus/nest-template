import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Address } from 'viem';
import { IsEthereumAddress } from 'class-validator';
import { ToLowerCase } from '@/helpers/decorators';

@Exclude()
export class NonceRequestDto {
  @Expose()
  @IsEthereumAddress()
  @ToLowerCase()
  @ApiProperty({
    type: String,
    example: '0xd0e4a05a84ce039be8647ca8089266117a7e96c5',
  })
  ethAddress: Address;
}
