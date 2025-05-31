import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';
import { Exclude, Expose } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';
import { LoginData } from '@/entities/auth';
import { HideInProd } from '@/helpers/decorators';

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
  @Optional()
  @HideInProd() // Field can be usefull while debugging
  refreshToken: string;

  @Expose()
  @IsInt()
  @ApiProperty({
    type: Number,
    example: 900000,
  })
  accessExpireMs: number;
  @Expose()
  @IsInt()
  @ApiProperty({
    type: Number,
    example: 259200000,
  })
  refreshExpireMs: number;
}
