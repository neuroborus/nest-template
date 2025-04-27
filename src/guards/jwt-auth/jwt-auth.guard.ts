import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Address } from 'viem';
import { UsersStore } from '@/stores/users';
import { RequestStore } from '@/stores/request';
import { AuthHeadersDto } from './auth-headers.dto';

interface AccessPayload {
  sub: string; // userId
  ethAddress: Address;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly users: UsersStore,
    private readonly requestStorage: RequestStore,
  ) {}

  private async validations(
    context: ExecutionContext,
  ): Promise<AuthHeadersDto> {
    const req = context.switchToHttp().getRequest<Request>();

    const instance: AuthHeadersDto = plainToInstance(
      AuthHeadersDto,
      req.headers,
      {
        enableImplicitConversion: true, // For transforms like ToLowerCase
        excludeExtraneousValues: true, // @Exclude/@Expose
      },
    );
    const errors = await validate(instance, {
      validationError: {
        target: false,
        value: false,
      },
    }); // Making sure we will not show secrets

    if (errors.length > 0) {
      const [first] = errors;
      const [message] = Object.values(first.constraints);
      throw new BadRequestException(message);
    }

    return instance;
  }

  private saveRequestData(ethAddress: Address): void {
    this.requestStorage.setEthAddress(ethAddress, JwtAuthGuard.name);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const headers = await this.validations(context);

    const authHeader = headers.authorization;

    const [, token] = authHeader.split(' ');
    try {
      const payload: AccessPayload = await this.jwt.verifyAsync(token);
      this.saveRequestData(payload.ethAddress);

      return true;
    } catch {
      return false;
    }
  }
}
