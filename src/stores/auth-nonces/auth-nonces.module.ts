import { Module } from '@nestjs/common';
import { PrismaDriverModule } from '@/drivers/prisma';
import { AuthNoncesProvider } from './auth-nonces.provider';
import { AuthNoncesStore } from './auth-nonces.store';

@Module({
  imports: [PrismaDriverModule],
  providers: [AuthNoncesProvider],
  exports: [AuthNoncesStore],
})
export class AuthNoncesModule {}
