import { Module } from '@nestjs/common';
import { createMulticallFactoryProvider } from 'ethers-tools-nestjs';
import { ContractsModule } from '@/contracts';
import { CoinService } from './coin.service';

const multicallFactoryProvider = createMulticallFactoryProvider(
  CoinService.name,
);

@Module({
  imports: [ContractsModule],
  providers: [multicallFactoryProvider, CoinService],
  exports: [CoinService],
})
export class CoinModule {}
