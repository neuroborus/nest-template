import { Injectable } from '@nestjs/common';
import { AuthNoncesStore } from '@/stores/auth-nonces';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class NonceCron {
  constructor(
    private readonly nonces: AuthNoncesStore,
    @InjectPinoLogger(NonceCron.name)
    private readonly logger: PinoLogger,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async clearExpired(): Promise<void> {
    const deleted = await this.nonces.deleteExpired();
    this.logger.trace({ deleted }, 'Expired auth-nonces cleared');
  }
}
