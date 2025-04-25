import { Module } from '@nestjs/common';
import { JwtAuthModule } from '@/guards/jwt-auth';
import { RequestModule } from '@/stores/request';
import { AuthModule } from '@/features/auth';
import { AuthController } from './auth.controller';

@Module({
  imports: [JwtAuthModule, AuthModule, RequestModule],
  controllers: [AuthController],
})
export class AuthApi {}
