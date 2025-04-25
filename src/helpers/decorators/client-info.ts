import { Request } from 'express';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ClientData } from '@/entities/user';

export const ClientInfo = createParamDecorator(
  (data, ctx: ExecutionContext): ClientData => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return {
      ipAddress: request.ip,
      userAgent: request.get('user-agent'),
    };
  },
);
