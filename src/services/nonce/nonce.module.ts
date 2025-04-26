import { Module } from '@nestjs/common';
import { AuthNoncesModule } from '@/stores/auth-nonces';
import { NonceService } from './nonce.service';
import { NonceCron } from './nonce.cron';

@Module({
  imports: [AuthNoncesModule],
  providers: [NonceService, NonceCron],
  exports: [NonceService],
})
export class NonceModule {}
