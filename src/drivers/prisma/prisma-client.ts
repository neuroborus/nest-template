import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient } from '@prisma/client';
import { Logger } from '@nestjs/common';
import { staticConfig } from '@/config';

const logger = new Logger('PrismaClient');
const adapter = new PrismaPg({ connectionString: staticConfig.databaseUrl });

export const PRISMA_CLIENT = new PrismaClient({
  adapter,
  log: [
    { level: 'info', emit: 'event' },
    { level: 'query', emit: 'event' },
    { level: 'warn', emit: 'event' },
    { level: 'error', emit: 'event' },
  ],
});

function prismaEventHandler(
  level: string,
): (event: Prisma.QueryEvent | Prisma.LogEvent) => void {
  return (event) => {
    if ('query' in event) {
      logger.log({
        level,
        message: 'Executed prisma query',
        details: {
          prismaQuery: event.query,
          prismaParams: event.params,
          prismaDuration: event.duration,
        },
      });
    } else {
      logger.log({
        level,
        message: event.message,
      });
    }
  };
}

PRISMA_CLIENT.$on('query', prismaEventHandler('trace'));

PRISMA_CLIENT.$on('info', prismaEventHandler('info'));

PRISMA_CLIENT.$on('error', prismaEventHandler('error'));

PRISMA_CLIENT.$on('warn', prismaEventHandler('warn'));
