import { IsString, Matches } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class AuthHeadersDto {
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
