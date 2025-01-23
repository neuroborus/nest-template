import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthStatus } from '@/entities/health';

@Injectable()
export class HealthService {
  constructor(private readonly config: ConfigService) {}

  check(): HealthStatus {
    return {
      status: 'OK',
      port: this.config.getOrThrow('port'),
      logLevel: this.config.getOrThrow('logLevel'),
    };
  }
}
