import { Module } from '@nestjs/common';
import {
  createAutoContractFactoryProvider,
  createMulticallFactoryProvider,
} from 'ethers-tools-nestjs';
import { Erc721Abi } from '@/contracts/abis';
import { NftService } from './nft.service';

const multicallFactoryProvider = createMulticallFactoryProvider(
  NftService.name,
);
const autoNftFactoryProvider = createAutoContractFactoryProvider(
  NftService.name,
  Erc721Abi,
);

@Module({
  providers: [multicallFactoryProvider, autoNftFactoryProvider, NftService],
  exports: [NftService],
})
export class NftModule {}
