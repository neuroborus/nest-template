import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';
import { NonceData } from '@/entities/auth';

@Exclude()
export class NonceResponseDto implements NonceData {
  @Expose()
  @IsUUID()
  @ApiProperty({
    type: String,
    example: 'aab3d5e5-2d4b-4140-8a7d-9701c8bb7678',
  })
  nonce: string;
}
