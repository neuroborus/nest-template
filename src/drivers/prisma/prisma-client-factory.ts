import { Prisma, PrismaClient } from '@prisma/client';
import { Logger } from '@nestjs/common';

const logger = new Logger('PrismaClient');

export function PrismaClientFactory(datasourceUrl: string) {
  const client = new PrismaClient({
    datasourceUrl,
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

  client.$on('query', prismaEventHandler('trace'));

  client.$on('info', prismaEventHandler('info'));

  client.$on('error', prismaEventHandler('error'));

  client.$on('warn', prismaEventHandler('warn'));

  return client;
}
