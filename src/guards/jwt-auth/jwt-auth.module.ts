import { Module } from '@nestjs/common';
import { JwtDriverModule } from '@/drivers/jwt';
import { RequestModule } from '@/stores/request';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [JwtDriverModule, RequestModule],
  providers: [JwtAuthGuard],
  exports: [JwtDriverModule, JwtAuthGuard, RequestModule], // Everything is needed
})
export class JwtAuthModule {}
