import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class LoginRequestDto {
  @Expose()
  @IsString()
  @ApiProperty({
    type: String,
    example:
      'localhost:3000 wants you to sign in with your Ethereum account:\n0xd0e4a05a84ce039be8647ca8089266117a7e96c5\n\nSign in\n\nURI: http://localhost:3000\nVersion: 1\nChain ID: 1\nNonce: n-0S8QX8v2jQL3J4\nIssued At: 2026-02-18T10:00:00.000Z',
  })
  message: string;

  @Expose()
  @IsString()
  @ApiProperty({
    type: String,
    example:
      '0x3baf3f2f54f55f4a03b0574de373c6521bb4ce29bc7aeca2a85ff07e029f1f1f2d1530ee29addcc81e2ed2755c747dabdbbebcaea393623f632a029a6368364a1b',
  })
  signature: string;
}
