import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PRISMA_TRANSACTION_OPTIONS, PrismaDriver } from '@/drivers/prisma';
import { Session } from '@/entities/user';

type Target = Pick<Session, 'userId' | 'ipAddress' | 'userAgent'>;

@Injectable()
export class SessionsStore {
  private readonly logger = new Logger(SessionsStore.name);
  constructor(
    private readonly prisma: PrismaDriver<'session'>,
    private readonly config: ConfigService,
  ) {}

  public transaction<R>(fn: (store: SessionsStore) => Promise<R>) {
    if (this.prisma.$transaction) {
      return this.prisma.$transaction(async (tx) => {
        return fn(new SessionsStore(tx, this.config));
      }, PRISMA_TRANSACTION_OPTIONS);
    } else {
      this.logger.warn('Tried to create nested transaction!');
      return fn(this);
    }
  }

  public upsert(id: string, target: Target, refreshTokenHash: string) {
    const expired = new Date(
      Date.now() + this.config.getOrThrow<number>('auth.refreshTokenTtlMs'),
    );
    return this.prisma.session.upsert({
      create: {
        id,
        refreshTokenHash,
        expired,
        ...target,
      },
      update: {
        id,
        refreshTokenHash,
        expired,
        ...target,
      },
      where: {
        target: {
          userId: target.userId,
          ipAddress: target.ipAddress,
          userAgent: target.userAgent,
        },
      },
    });
  }

  public get(id: string): Promise<Session | null> {
    return this.prisma.session.findUnique({
      where: {
        id,
      },
    });
  }

  public delete(id: string): Promise<Session | null> {
    return this.prisma.session.delete({
      where: {
        id,
      },
    });
  }

  public async deleteExpired(): Promise<number> {
    const deleted = await this.prisma.session.deleteMany({
      where: {
        expired: {
          lt: new Date(),
        },
      },
    });
    return deleted.count;
  }
}
