import { Module } from '@nestjs/common';
import { ConfigModule } from '@/config';
import { HealthApi } from './apis/health';

@Module({
  imports: [ConfigModule, HealthApi],
})
export class AppModule {}
