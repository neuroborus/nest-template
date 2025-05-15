import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Address } from 'viem';
import { AuthNonce } from '@/entities/auth';
import {
  PRISMA_TRANSACTION_OPTIONS,
  PrismaDriver,
  Prisma,
  PrismaArgs,
} from '@/drivers/prisma';
import { randomAuthNonce, randomId } from '@/helpers/random';

@Injectable()
export class AuthNoncesStore {
  constructor(
    private readonly prisma: PrismaDriver<'authNonce'>,
    private readonly config: ConfigService,
    @InjectPinoLogger(AuthNoncesStore.name)
    private readonly logger: PinoLogger,
  ) {}

  public transaction<R>(fn: (store: AuthNoncesStore) => Promise<R>) {
    if (this.prisma.$transaction) {
      return this.prisma.$transaction(async (tx) => {
        return fn(new AuthNoncesStore(tx, this.config, this.logger));
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

  public async deleteMany(
    filters: {
      expiredBefore?: Date;
    } = {},
  ): Promise<number> {
    const { expiredBefore } = filters;
    const findArgs: PrismaArgs<'authNonce', 'deleteMany'> = {};

    if (expiredBefore) {
      findArgs.where = {
        expired: {
          lt: expiredBefore,
        },
      };
    }

    const payload = await this.prisma.authNonce.deleteMany(findArgs);
    return payload.count;
  }
}
