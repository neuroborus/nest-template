import { Module } from '@nestjs/common';
import { PrismaDriverService } from './prisma-driver.service';
import { PrismaClientProvider } from './prisma-client.provider';

@Module({
  providers: [PrismaClientProvider, PrismaDriverService],
  exports: [PrismaDriverService],
})
export class PrismaDriverModule {}
