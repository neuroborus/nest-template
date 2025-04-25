import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEthereumAddress, IsString } from 'class-validator';
import { Address } from 'viem';
import { ToLowerCase } from '@/helpers/decorators';

@Exclude()
export class LoginRequestDto {
  @Expose()
  @IsEthereumAddress()
  @ToLowerCase()
  @ApiProperty({
    type: String,
    example: '0xd0e4a05a84ce039be8647ca8089266117a7e96c5',
  })
  ethAddress: Address;

  @Expose()
  @IsString()
  @ApiProperty({
    type: String,
    example:
      '0x3baf3f2f54f55f4a03b0574de373c6521bb4ce29bc7aeca2a85ff07e029f1f1f2d1530ee29addcc81e2ed2755c747dabdbbebcaea393623f632a029a6368364a1b',
  })
  signedNonce: string;
}
