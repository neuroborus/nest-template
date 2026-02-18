import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SiweMessage } from 'siwe';
import { Address } from 'viem';
import { AuthNoncesStore } from '@/stores/auth-nonces';
import { NonceData } from '@/entities/auth';

export interface ValidatedSiweData {
  address: Address;
  nonce: string;
  chainId: number;
}

@Injectable()
export class NonceService {
  constructor(
    private readonly config: ConfigService,
    private readonly nonces: AuthNoncesStore,
  ) {}

  private validateUri(messageUri: string): boolean {
    const expected = this.config.getOrThrow<string>('auth.siweUri');

    if (messageUri === expected) return true;

    try {
      const parsed = new URL(messageUri);
      const expectedParsed = new URL(expected);
      return parsed.origin === expectedParsed.origin;
    } catch {
      return false;
    }
  }

  public async create(): Promise<NonceData> {
    const created = await this.nonces.create();
    return {
      nonce: created.nonce,
      expiresAt: created.expiresAt,
    };
  }

  public async validateSiwe(
    message: string,
    signature: string,
  ): Promise<ValidatedSiweData> {
    let siwe: SiweMessage;
    try {
      siwe = new SiweMessage(message);
    } catch {
      throw new HttpException('Invalid SIWE message format', 401);
    }

    if (siwe.version !== '1') {
      throw new HttpException('Invalid SIWE version', 401);
    }

    const expectedDomain = this.config.getOrThrow<string>('auth.siweDomain');
    if (siwe.domain !== expectedDomain) {
      throw new HttpException('SIWE domain mismatch', 401);
    }

    if (!this.validateUri(siwe.uri)) {
      throw new HttpException('SIWE uri mismatch', 401);
    }

    const allowedChainIds = this.config.getOrThrow<number[]>(
      'auth.siweAllowedChainIds',
    );
    if (!allowedChainIds.includes(siwe.chainId)) {
      throw new HttpException('SIWE chainId is not allowed', 401);
    }

    if (!siwe.issuedAt) {
      throw new HttpException('SIWE issuedAt is required', 401);
    }

    const issuedAtMs = Date.parse(siwe.issuedAt);
    if (Number.isNaN(issuedAtMs)) {
      throw new HttpException('SIWE issuedAt is invalid', 401);
    }

    const nowMs = Date.now();
    const issuedAtTtlMs = this.config.getOrThrow<number>(
      'auth.siweIssuedAtTtlMs',
    );
    const clockSkewMs = this.config.getOrThrow<number>('auth.siweClockSkewMs');
    if (issuedAtMs < nowMs - issuedAtTtlMs - clockSkewMs) {
      throw new HttpException('SIWE issuedAt is too old', 401);
    }
    if (issuedAtMs > nowMs + clockSkewMs) {
      throw new HttpException('SIWE issuedAt is in the future', 401);
    }

    const nonce = await this.nonces.get(siwe.nonce);
    if (!nonce || nonce.expiresAt <= new Date() || nonce.usedAt) {
      throw new HttpException('Invalid or expired nonce', 401);
    }

    const verification = await siwe.verify(
      {
        signature,
        domain: expectedDomain,
        nonce: siwe.nonce,
        time: new Date().toISOString(),
      },
      {
        suppressExceptions: true,
        // TODO: Add an ethers provider for EIP-1271 contract-wallet signature verification.
      },
    );
    if (!verification.success) {
      throw new HttpException('Wrong signature', 401);
    }

    const consumed = await this.nonces.consume(siwe.nonce, siwe.address);
    if (!consumed) {
      throw new HttpException('Nonce already used or expired', 401);
    }

    return {
      address: siwe.address.toLowerCase() as Address,
      nonce: siwe.nonce,
      chainId: siwe.chainId,
    };
  }
}
