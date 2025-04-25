import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaDriverService } from '@/drivers/prisma';
import { UsersStore } from './users.store';

export const UsersProvider: Provider<UsersStore> = {
  provide: UsersStore,
  async useFactory(
    prisma: PrismaDriverService,
    config: ConfigService,
  ): Promise<UsersStore> {
    return new UsersStore(prisma.client, config);
  },
  inject: [PrismaDriverService, ConfigService],
};
