import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Address } from 'viem';
import { LoginData } from '@/entities/auth/login-data';
import { RequestStore } from '@/stores/request';
import { NonceService } from '@/services/nonce';
import { SessionService } from '@/services/session';
import { NonceData } from '@/entities/auth';

@Injectable()
export class AuthFeature {
  constructor(
    private readonly request: RequestStore,
    private readonly nonce: NonceService,
    private readonly session: SessionService,
    @InjectPinoLogger(AuthFeature.name)
    private readonly logger: PinoLogger,
  ) {}

  public async createNonce(ethAddress: Address): Promise<NonceData> {
    const nonce = await this.nonce.create(ethAddress);
    return {
      nonce,
    };
  }

  public async createSession(
    ethAddress: Address,
    signedNonce: string,
  ): Promise<LoginData> {
    await this.nonce.validate(ethAddress, signedNonce);

    const clientData = this.request.clientData;
    return this.session.create(
      ethAddress,
      clientData.ipAddress,
      clientData.userAgent,
    );
  }

  public async refreshSession(refreshToken: string): Promise<LoginData> {
    const clientData = this.request.clientData;
    return this.session.refresh(
      clientData.ipAddress,
      clientData.userAgent,
      refreshToken,
    );
  }
}
