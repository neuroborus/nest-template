import { Controller, Get, Header, SerializeOptions } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

@Controller('health')
export class HealthController {
  @Get()
  @Header('Content-Type', 'text/plain')
  @ApiResponse({
    status: 200,
    description: 'Health check',
    schema: {
      type: 'string',
      example: 'OK',
    },
  })
  @SerializeOptions({ type: String })
  getHealth(): string {
    return 'OK';
  }
}
