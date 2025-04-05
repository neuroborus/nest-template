import { Module } from '@nestjs/common';
import { createMulticallFactoryProvider } from 'ethers-tools-nestjs';
import { ContractsModule } from '@/contracts';
import { TokenService } from './token.service';

const multicallFactoryProvider = createMulticallFactoryProvider(
  TokenService.name,
);

@Module({
  imports: [ContractsModule],
  providers: [multicallFactoryProvider, TokenService],
  exports: [TokenService],
})
export class TokenModule {}
