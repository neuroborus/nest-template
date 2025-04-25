import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { PrismaClientFactory } from './prisma-client-factory';

export const PrismaClientProvider: Provider<PrismaClient> = {
  provide: PrismaClient,
  useFactory(config: ConfigService) {
    return PrismaClientFactory(config.getOrThrow('DATABASE_URL'));
  },
  inject: [ConfigService],
};
