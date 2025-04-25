import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Address } from 'viem';
import { LoginData } from '@/entities/auth/login-data';
import { UsersStore } from '@/stores/users';
import { SessionsStore } from '@/stores/sessions';
import { hash } from '@/helpers/security';
import { randomId } from '@/helpers/random';

interface RefreshPayload {
  sub: string; // userId
  sessionId: string;
}

@Injectable()
export class SessionService {
  constructor(
    private readonly config: ConfigService,
    private readonly users: UsersStore,
    private readonly sessions: SessionsStore,
    private readonly jwt: JwtService,
  ) {}

  private async generateTokens(
    userId: string,
    sessionId: string,
  ): Promise<LoginData> {
    const accessExpireSeconds = Math.floor(
      this.config.getOrThrow<number>('auth.accessTokenTtlMs') / 1000,
    );
    const refreshExpireSeconds = Math.floor(
      this.config.getOrThrow<number>('auth.refreshTokenTtlMs') / 1000,
    );

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(
        { sub: userId },
        {
          expiresIn: accessExpireSeconds,
          secret: this.config.getOrThrow('auth.accessSecret'),
        },
      ),
      this.jwt.signAsync(
        {
          sub: userId,
          sessionId,
        },
        {
          expiresIn: refreshExpireSeconds,
          secret: this.config.getOrThrow('auth.refreshSecret'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
      accessExpireSeconds,
      refreshExpireSeconds,
    };
  }

  public async create(
    ethAddress: Address,
    ipAddress: string,
    userAgent: string,
  ): Promise<LoginData> {
    let user = await this.users.get(ethAddress);
    if (!user) user = await this.users.create(ethAddress);

    const sessionId = randomId();
    const tokens = await this.generateTokens(user.id, sessionId);

    const refreshTokenHash = hash(tokens.refreshToken);
    await this.sessions.upsert(
      sessionId,
      {
        userId: user.id,
        ipAddress,
        userAgent,
      },
      refreshTokenHash,
    );

    return tokens;
  }

  public async refresh(
    ipAddress: string,
    userAgent: string,
    refreshToken: string,
  ): Promise<LoginData> {
    const wrongTokenErr = new HttpException('Wrong token', 401);

    let payload: RefreshPayload;
    try {
      payload = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.getOrThrow('auth.refreshSecret'),
      });
    } catch {
      throw wrongTokenErr; // Payload has not required fields - wrong token
    }

    const session = await this.sessions.get(payload.sessionId);
    if (!session) throw wrongTokenErr; // Session not found
    if (session.expired < new Date()) {
      // The Session expired and will be deleted soon
      await this.sessions.delete(payload.sessionId);
      throw wrongTokenErr;
    }

    if (session.refreshTokenHash !== hash(refreshToken)) {
      // Tokens are not match
      await this.sessions.delete(payload.sessionId);
      throw wrongTokenErr;
    }

    const tokens = await this.generateTokens(payload.sub, payload.sessionId);

    await this.sessions.upsert(
      payload.sessionId,
      {
        userId: payload.sub,
        ipAddress,
        userAgent,
      },
      hash(tokens.refreshToken),
    );

    return tokens;
  }
}
