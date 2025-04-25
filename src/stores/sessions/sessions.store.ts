import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PRISMA_TRANSACTION_OPTIONS, PrismaDriver } from '@/drivers/prisma';
import { Session } from '@/entities/user';
import { randomId } from '@/helpers/random';

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

  public create(
    session: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Session> {
    // Will throw an error if already exist
    return this.prisma.session.create({
      data: {
        id: randomId(),
        ...session,
      },
    });
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

  public update(
    id: string,
    data: Partial<Omit<Session, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Session> {
    // Will throw an error if already exist
    return this.prisma.session.update({
      where: {
        id,
      },
      data,
    });
  }

  public find(target: Target): Promise<Session> {
    return this.prisma.session.findUnique({
      where: {
        target,
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
}
