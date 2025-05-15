import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth';

export function AuthEndpoint() {
  return applyDecorators(ApiBearerAuth(), UseGuards(JwtAuthGuard));
}
