import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';
import { NonceData } from '@/entities/auth';

@Exclude()
export class NonceResponseDto implements NonceData {
  @Expose()
  @IsString()
  @ApiProperty({
    type: String,
    example: 'n-0S8QX8v2jQL3J4',
  })
  nonce: string;

  @Expose()
  @IsDate()
  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-02-18T10:05:00.000Z',
  })
  expiresAt: Date;
}
