import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Address } from 'viem';
import {
  PRISMA_TRANSACTION_OPTIONS,
  PrismaDriver,
  Prisma,
} from '@/drivers/prisma';
import { randomId } from '@/helpers/random';
import { User } from '@/entities/user';

@Injectable()
export class UsersStore {
  private readonly logger = new Logger(UsersStore.name);
  constructor(
    private readonly prisma: PrismaDriver<'user'>,
    private readonly config: ConfigService,
  ) {}

  public transaction<R>(fn: (store: UsersStore) => Promise<R>) {
    if (this.prisma.$transaction) {
      return this.prisma.$transaction(async (tx) => {
        return fn(new UsersStore(tx, this.config));
      }, PRISMA_TRANSACTION_OPTIONS);
    } else {
      this.logger.warn('Tried to create nested transaction!');
      return fn(this);
    }
  }

  private decode(model: Prisma.User): User {
    return {
      ...model,
      ethAddress: model.ethAddress as Address,
    };
  }

  public async create(ethAddress: Address): Promise<User> {
    // Will throw an error if already exist
    const user = await this.prisma.user.create({
      data: {
        id: randomId(),
        ethAddress: ethAddress.toLowerCase(),
      },
    });
    return this.decode(user);
  }

  public async get(ethAddress: Address): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        ethAddress: ethAddress.toLowerCase(),
      },
    });
    if (!user) return null;
    return this.decode(user);
  }
}
