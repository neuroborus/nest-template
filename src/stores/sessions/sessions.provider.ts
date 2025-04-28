import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { PrismaDriverService } from '@/drivers/prisma';
import { SessionsStore } from './sessions.store';

export const SessionsProvider: Provider<SessionsStore> = {
  provide: SessionsStore,
  async useFactory(
    prisma: PrismaDriverService,
    config: ConfigService,
    logger: PinoLogger,
  ): Promise<SessionsStore> {
    return new SessionsStore(prisma.client, config, logger);
  },
  inject: [PrismaDriverService, ConfigService],
};
