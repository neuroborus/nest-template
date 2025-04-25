import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth';

export function AuthEndpoint() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiHeader({
      name: 'ethAddress',
      description: 'Ethereum address of the user',
      required: true,
    }),
    UseGuards(JwtAuthGuard),
  );
}
