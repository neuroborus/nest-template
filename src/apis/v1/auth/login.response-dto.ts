import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { LoginData } from '@/entities/auth';

@Exclude()
export class LoginResponseDto implements LoginData {
  @Expose()
  @IsString()
  @ApiProperty({
    type: String,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1N2VjM2Q2ZC0xNDU5LTQ4YmQtOTQ3Zi1iZmM0MTk5ODE3NmMiLCJpYXQiOjE3NDU0OTMxOTQsImV4cCI6MTc0NTU3OTU5NH0.psVY-3IwWKxzdmlTzHIkCZAWDHAjiyct6QV5FvjRfGw',
  })
  accessToken: string;
  @Expose()
  @IsString()
  @ApiProperty({
    type: String,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1N2VjM2Q2ZC0xNDU5LTQ4YmQtOTQ3Zi1iZmM0MTk5ODE3NmMiLCJzZXNzaW9uSWQiOiJmOTFlYWIxMi1kNDZmLTQ0YjUtOGMwMC01ZTExMjA1NzY0MTQiLCJpYXQiOjE3NDU0OTMxOTQsImV4cCI6MTc0NjA5Nzk5NH0.d2e0ixcIg4R9_Xpsm1EUJdcRgft9Iws-kicpvEwnqYM',
  })
  refreshToken: string;

  @Expose()
  @IsNumber()
  @ApiProperty({
    type: Number,
    example: 86400000,
  })
  accessExpireMs: number;
  @Expose()
  @IsNumber()
  @ApiProperty({
    type: Number,
    example: 604800000,
  })
  refreshExpireMs: number;
}
