import { Module } from '@nestjs/common';
import { JwtDriverModule } from '@/drivers/jwt';
import { UsersModule } from '@/stores/users';
import { RequestModule } from 'src/stores/request';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [JwtDriverModule, UsersModule, RequestModule],
  providers: [JwtAuthGuard],
  exports: [JwtDriverModule, JwtAuthGuard, UsersModule], // Everything is needed
})
export class JwtAuthModule {}
