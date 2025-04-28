import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { PrismaDriverService } from '@/drivers/prisma';
import { UsersStore } from './users.store';

export const UsersProvider: Provider<UsersStore> = {
  provide: UsersStore,
  async useFactory(
    prisma: PrismaDriverService,
    config: ConfigService,
    logger: PinoLogger,
  ): Promise<UsersStore> {
    return new UsersStore(prisma.client, config, logger);
  },
  inject: [PrismaDriverService, ConfigService],
};
