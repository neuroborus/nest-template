import { Module } from '@nestjs/common';
import { PrismaDriverModule } from '@/drivers/prisma';
import { SessionsProvider } from './sessions.provider';
import { SessionsStore } from './sessions.store';

@Module({
  imports: [PrismaDriverModule],
  providers: [SessionsProvider],
  exports: [SessionsStore],
})
export class SessionsModule {}
