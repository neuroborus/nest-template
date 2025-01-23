import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { HealthStatus } from '@/entities/health';

@Exclude()
export class HealthStatusDto implements HealthStatus {
  @Expose()
  @IsString()
  @ApiProperty({ type: String, example: 'OK' })
  status: string;

  @Expose()
  @IsNumber()
  @ApiProperty({ type: Number, example: 3000 })
  port: number;

  @Expose()
  @IsString()
  @ApiProperty({ type: String, example: 'info' })
  logLevel: string;
}
