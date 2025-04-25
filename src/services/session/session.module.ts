import { Module } from '@nestjs/common';
import { JwtDriverModule } from '@/drivers/jwt';
import { UsersModule } from '@/stores/users';
import { SessionsModule } from '@/stores/sessions';
import { SessionService } from './session.service';

@Module({
  imports: [SessionsModule, UsersModule, JwtDriverModule],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
