import { Module } from '@nestjs/common';
import { NftModule } from '@/services/nft';
import { NftController } from './nft.controller';

@Module({
  imports: [NftModule],
  controllers: [NftController],
})
export class NftApi {}
