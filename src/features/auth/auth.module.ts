import { Module } from '@nestjs/common';
import { RequestModule } from '@/stores/request';
import { SessionModule } from '@/services/session';
import { NonceModule } from '@/services/nonce';
import { AuthFeature } from './auth.feature';

@Module({
  imports: [SessionModule, NonceModule, RequestModule],
  providers: [AuthFeature],
  exports: [AuthFeature],
})
export class AuthModule {}
