import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaClientFactory } from './prisma-client-factory';

@Injectable()
export class PrismaDriverService implements OnModuleInit, OnModuleDestroy {
  private readonly clientsUsage: Map<PrismaClient, number>;

  constructor(public client: PrismaClient) {}

  async onModuleInit(): Promise<void> {
    await this.client.$connect();
  }

  async onDatasourceUrlChange(datasourceUrl: string): Promise<void> {
    const client = PrismaClientFactory(datasourceUrl);
    try {
      await client.$connect();

      const oldClient = this.client;

      this.client = client;

      await oldClient.$disconnect();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {}
  }

  async useClient<R>(fn: (client: PrismaClient) => Promise<R>): Promise<R> {
    const client = this.client;

    this.clientsUsage.set(client, (this.clientsUsage.get(client) ?? 0) + 1);

    try {
      return await fn(client);
    } finally {
      const usage = this.clientsUsage.get(client) ?? 0;

      if (usage > 1 || this.client === client) {
        this.clientsUsage.set(client, usage - 1);
      } else {
        this.clientsUsage.delete(client);

        try {
          await client.$disconnect();
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {}
      }
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.$disconnect();
  }
}
