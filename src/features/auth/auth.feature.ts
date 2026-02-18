import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
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

  public async createNonce(): Promise<NonceData> {
    const nonce = await this.nonce.create();
    this.logger.trace(
      {
        nonce,
      },
      'Nonce created',
    );
    return nonce;
  }

  public async createSession(
    message: string,
    signature: string,
  ): Promise<LoginData> {
    const validated = await this.nonce.validateSiwe(message, signature);

    const clientData = this.request.clientData;
    const loginData = await this.session.create(
      validated.address,
      clientData.ipAddress,
      clientData.userAgent,
    );
    this.logger.trace(
      {
        ethAddress: validated.address,
        nonce: validated.nonce,
        chainId: validated.chainId,
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
