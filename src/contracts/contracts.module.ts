import { Module } from '@nestjs/common';
import { createContractFactoryProvider } from 'ethers-tools-nestjs';
import { Erc20Contract } from './erc20.contract';
import { Erc20Abi } from './abis';

const erc20factory = createContractFactoryProvider(Erc20Contract, {
  abi: Erc20Abi,
});

@Module({
  providers: [erc20factory],
  exports: [erc20factory],
})
export class ContractsModule {}
