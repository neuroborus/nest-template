import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
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
      usedAt: model.usedAt ?? null,
      usedByAddress: model.usedByAddress ?? null,
    };
  }

  public async create(): Promise<AuthNonce> {
    const expiresAt = new Date(
      Date.now() + this.config.getOrThrow<number>('auth.authNonceTtlMs'),
    );

    const nonce = await this.prisma.authNonce.create({
      data: {
        id: randomId(),
        expiresAt,
        nonce: randomAuthNonce(),
      },
    });
    return this.decode(nonce);
  }

  public async get(nonceValue: string): Promise<AuthNonce | null> {
    const nonce = await this.prisma.authNonce.findUnique({
      where: {
        nonce: nonceValue,
      },
    });
    if (!nonce) return null;
    return this.decode(nonce);
  }

  public async consume(nonce: string, usedByAddress: string): Promise<boolean> {
    const payload = await this.prisma.authNonce.updateMany({
      where: {
        nonce,
        usedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      data: {
        usedAt: new Date(),
        usedByAddress: usedByAddress.toLowerCase(),
      },
    });
    return payload.count === 1;
  }

  public async deleteMany(
    filters: {
      expiresBefore?: Date;
    } = {},
  ): Promise<number> {
    const { expiresBefore } = filters;
    const findArgs: PrismaArgs<'authNonce', 'deleteMany'> = {};

    if (expiresBefore) {
      findArgs.where = {
        expiresAt: {
          lt: expiresBefore,
        },
      };
    }

    const payload = await this.prisma.authNonce.deleteMany(findArgs);
    return payload.count;
  }
}
