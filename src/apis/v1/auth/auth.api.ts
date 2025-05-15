import { Module } from '@nestjs/common';
import { JwtAuthModule } from '@/guards/jwt-auth';
import { AuthModule } from '@/features/auth';
import { AuthController } from './auth.controller';

@Module({
  imports: [JwtAuthModule, AuthModule],
  controllers: [AuthController],
})
export class AuthApi {}
