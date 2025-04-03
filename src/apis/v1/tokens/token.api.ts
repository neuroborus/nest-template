import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import { TokenModule } from '@/services/token';

@Module({
  imports: [TokenModule],
  controllers: [TokenController],
})
export class TokenApi {}
