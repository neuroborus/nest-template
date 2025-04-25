import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verifyMessage, Address } from 'viem';
import { AuthNoncesStore } from '@/stores/auth-nonces';

@Injectable()
export class NonceService {
  constructor(
    private readonly config: ConfigService,
    private readonly nonces: AuthNoncesStore,
  ) {}

  public async create(ethAddress: Address): Promise<string> {
    const existing = await this.nonces.get(ethAddress);

    if (existing) {
      const existsMs = Date.now() - existing.createdAt.getTime();
      const creationDelay = this.config.getOrThrow<number>(
        'auth.authNonceCreationDelayMs',
      );

      const difference = creationDelay - existsMs;
      if (difference > 0) {
        throw new HttpException(
          `Wait at least ${Math.floor(difference / 1000)} seconds before making a new attempt`,
          401,
        );
      } else {
        await this.nonces.delete(ethAddress);
      }
    }

    const created = await this.nonces.create(ethAddress);
    return created.nonce;
  }

  public async validate(
    ethAddress: Address,
    signedNonce: string,
  ): Promise<void> {
    const nonce = await this.nonces.get(ethAddress);

    if (!nonce)
      throw new HttpException('Invalid address or nonce has been expired', 401);

    const isValid = await verifyMessage({
      address: ethAddress,
      message: nonce.nonce,
      signature: signedNonce as `0x${string}`,
    });

    if (!isValid) throw new HttpException('Wrong signature', 401);

    await this.nonces.delete(ethAddress);
  }
}
