import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Address } from 'viem';
import { AuthNonce } from '@/entities/auth';
import {
  PRISMA_TRANSACTION_OPTIONS,
  PrismaDriver,
  Prisma,
} from '@/drivers/prisma';
import { randomAuthNonce, randomId } from '@/helpers/random';

@Injectable()
export class AuthNoncesStore {
  private readonly logger = new Logger(AuthNoncesStore.name);
  constructor(
    private readonly prisma: PrismaDriver<'authNonce'>,
    private readonly config: ConfigService,
  ) {}

  public transaction<R>(fn: (store: AuthNoncesStore) => Promise<R>) {
    if (this.prisma.$transaction) {
      return this.prisma.$transaction(async (tx) => {
        return fn(new AuthNoncesStore(tx, this.config));
      }, PRISMA_TRANSACTION_OPTIONS);
    } else {
      this.logger.warn('Tried to create nested transaction!');
      return fn(this);
    }
  }

  private decode(model: Prisma.AuthNonce): AuthNonce {
    return {
      ...model,
      ethAddress: model.ethAddress as Address,
    };
  }

  public async create(ethAddress: Address): Promise<AuthNonce> {
    // Will throw an error if already exist
    const nonce = await this.prisma.authNonce.create({
      data: {
        id: randomId(),
        expired: new Date(
          Date.now() + this.config.getOrThrow<number>('auth.authNonceTtlMs'),
        ),
        ethAddress: ethAddress.toLowerCase(),
        nonce: randomAuthNonce(),
      },
    });
    return this.decode(nonce);
  }

  public async get(ethAddress: Address): Promise<AuthNonce | null> {
    const nonce = await this.prisma.authNonce.findUnique({
      where: {
        ethAddress: ethAddress.toLowerCase(),
      },
    });
    if (!nonce) return null;
    return this.decode(nonce);
  }

  public async delete(ethAddress: Address): Promise<AuthNonce | null> {
    const nonce = await this.prisma.authNonce.delete({
      where: {
        ethAddress: ethAddress.toLowerCase(),
      },
    });
    if (!nonce) return null;
    return this.decode(nonce);
  }

  public async deleteExpired(): Promise<number> {
    const deleted = await this.prisma.authNonce.deleteMany({
      where: {
        expired: {
          lt: new Date(),
        },
      },
    });
    return deleted.count;
  }
}
