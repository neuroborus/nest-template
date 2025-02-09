import { Module } from '@nestjs/common';
import { ConfigModule } from '@/config';
import { HealthApi } from './apis/health';
import { TokenApi } from './apis/token';

@Module({
  imports: [ConfigModule, HealthApi, TokenApi],
})
export class AppModule {}
