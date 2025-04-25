import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Address } from 'viem';
import { UsersStore } from '@/stores/users';
import { RequestStore } from 'src/stores/request';
import { plainToInstance } from 'class-transformer';
import { AuthHeadersDto } from './auth-headers.dto';
import { validate } from 'class-validator';

interface AccessPayload {
  sub: string; // userId
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

  private async verifyAccess(
    ethAddress: Address,
    accessToken: string,
  ): Promise<boolean> {
    // Guard is not using location or agent

    const user = await this.users.get(ethAddress);
    if (!user) return false;

    const payload: AccessPayload = await this.jwt.verifyAsync(accessToken);

    return payload.sub === user.id;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const headers = await this.validations(context);

    const authHeader = headers.authorization;
    const ethAddress = headers.ethAddress;
    if (!ethAddress || !authHeader?.startsWith('Bearer ')) return false;

    this.saveRequestData(ethAddress);

    const [, token] = authHeader.split(' ');
    try {
      return await this.verifyAccess(ethAddress, token);
    } catch {
      return false;
    }
  }
}
