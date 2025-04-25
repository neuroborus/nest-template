import { Request } from 'express';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Scope,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientData } from '@/entities/user';
import { RequestStore } from 'src/stores/request';

@Injectable({ scope: Scope.REQUEST })
export class ClientInfoInterceptor implements NestInterceptor {
  constructor(private readonly reqStorage: RequestStore) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<Request>();
    const clientData: ClientData = {
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    };

    this.reqStorage.setClientData(clientData, ClientInfoInterceptor.name);

    return next.handle();
  }
}
