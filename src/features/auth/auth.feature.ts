import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Address } from 'viem';
import { LoginData, NonceData } from '@/entities/auth';
import { RequestStore } from '@/stores/request';
import { NonceService } from '@/services/nonce';
import { SessionService } from '@/services/session';

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
    this.logger.trace(
      {
        nonce,
        ethAddress,
      },
      'Nonce created',
    );
    // !: Standard ERC-4361 can be provided
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
    const loginData = await this.session.create(
      ethAddress,
      clientData.ipAddress,
      clientData.userAgent,
    );
    this.logger.trace(
      {
        ethAddress,
        ...clientData,
      },
      'Session created',
    );
    return loginData;
  }

  public async refreshSession(refreshToken: string): Promise<LoginData> {
    const clientData = this.request.clientData;
    const refreshData = await this.session.refresh(
      clientData.ipAddress,
      clientData.userAgent,
      refreshToken,
    );
    this.logger.trace(
      {
        ethAddress: refreshData.ethAddress,
        ...clientData,
      },
      'Session refreshed',
    );
    return refreshData.loginData;
  }

  public async deleteSession(): Promise<void> {
    const sessionId = this.request.sessionId;
    await this.session.deleteSession(sessionId);
    this.logger.trace(
      {
        ethAddress: this.request.ethAddress,
        ...this.request.clientData,
      },
      'Session deleted',
    );
  }
}
