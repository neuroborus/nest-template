import { IsEthereumAddress, IsString, Matches } from 'class-validator';
import { Address } from 'viem';
import { ToLowerCase } from '@/helpers/decorators';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class AuthHeadersDto {
  @Expose({ name: 'ethaddress' })
  @IsEthereumAddress()
  @ToLowerCase()
  @ApiProperty({
    type: String,
    example: '0xd0e4a05a84ce039be8647ca8089266117a7e96c5',
  })
  ethAddress: Address;

  @Expose()
  @IsString()
  @Matches(/^Bearer\s.+$/, {
    message: 'Authorization header must be a Bearer token',
  })
  @ApiProperty({
    type: String,
    example: 'Bearer <token>',
  })
  authorization: string;
}
