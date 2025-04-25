import { Module } from '@nestjs/common';
import { PrismaDriverModule } from '@/drivers/prisma';
import { UsersProvider } from './users.provider';
import { UsersStore } from './users.store';

@Module({
  imports: [PrismaDriverModule],
  providers: [UsersProvider],
  exports: [UsersStore],
})
export class UsersModule {}
