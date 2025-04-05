import { Module } from '@nestjs/common';
import { CoinController } from './coin.controller';
import { CoinModule } from 'src/services/coin';

@Module({
  imports: [CoinModule],
  controllers: [CoinController],
})
export class CoinApi {}
