import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaDriverService } from '@/drivers/prisma';
import { AuthNoncesStore } from './auth-nonces.store';

export const AuthNoncesProvider: Provider<AuthNoncesStore> = {
  provide: AuthNoncesStore,
  async useFactory(
    prisma: PrismaDriverService,
    config: ConfigService,
  ): Promise<AuthNoncesStore> {
    return new AuthNoncesStore(prisma.client, config);
  },
  inject: [PrismaDriverService, ConfigService],
};
