import { Module } from '@nestjs/common';
import { ConfigModule } from '@/config';
import { HealthApi } from './apis/health';
import { TokenhApi } from './apis/token';
import { AbiModule } from './abis';

@Module({
  imports: [ConfigModule, AbiModule, HealthApi, TokenhApi],
})
export class AppModule {}
