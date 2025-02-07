import { Module } from '@nestjs/common';
import { TokenModule } from '@/services/token';
import { TokenController } from './token.controller';

@Module({
  imports: [TokenModule],
  controllers: [TokenController],
})
export class TokenApi {}
