import { Controller, Get, SerializeOptions } from '@nestjs/common';
import { HealthService } from '@/services/health';
import { ApiResponse } from '@nestjs/swagger';
import { HealthStatus } from '@/entities/health';
import { HealthStatusDto } from '@/apis/health/health-status.dto';

@Controller('health')
export class HealthController {
  constructor(private readonly health: HealthService) {}

  @Get()
  @ApiResponse({ status: 200, type: HealthStatusDto })
  @SerializeOptions({ type: HealthStatusDto })
  getHealth(): HealthStatus {
    return this.health.check();
  }
}
