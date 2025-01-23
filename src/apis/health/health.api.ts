import { Module } from '@nestjs/common';
import { HealthModule } from '@/services/health';
import { HealthController } from './health.controller';

@Module({
  imports: [HealthModule],
  controllers: [HealthController],
})
export class HealthApi {}
