import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SessionsStore } from '@/stores/sessions';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class SessionCron {
  constructor(
    private readonly sessions: SessionsStore,
    @InjectPinoLogger(SessionCron.name)
    private readonly logger: PinoLogger,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async clearExpired(): Promise<void> {
    const deleted = await this.sessions.deleteExpired();
    this.logger.trace({ deleted }, 'Expired sessions cleared');
  }
}
