import { Module } from '@nestjs/common';
import { CoinApi } from './coins';
import { NftApi } from './nfts';

@Module({
  imports: [CoinApi, NftApi],
})
export class V1Api {}
