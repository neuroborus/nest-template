import { Module } from '@nestjs/common';
import { AuthNoncesModule } from '@/stores/auth-nonces';
import { NonceService } from './nonce.service';

@Module({
  imports: [AuthNoncesModule],
  providers: [NonceService],
  exports: [NonceService],
})
export class NonceModule {}
