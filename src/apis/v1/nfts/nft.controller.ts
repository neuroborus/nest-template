import { Controller, Get, Param, SerializeOptions } from '@nestjs/common';
import { ApiParam, ApiResponse } from '@nestjs/swagger';
import { Chain } from 'ethers-tools';
import { activeChains } from '@/config';
import { NftService } from '@/services/nft';
import { NftInfo } from '@/entities/nft';
import { NftInfoDto } from './nft-info.dto';

@Controller('v1/nft')
export class NftController {
  constructor(private readonly nft: NftService) {}

  @Get(':chain/:nftAddress')
  @ApiParam({
    name: 'chain',
    enum: activeChains,
    description: 'Blockchain network',
    example: 1,
  })
  @ApiParam({
    name: 'nftAddress',
    type: String,
    description: 'NFT address',
    example: '0xbd3531da5cf5857e7cfaa92426877b022e612cf8',
  })
  @ApiResponse({ status: 200, type: NftInfoDto })
  @SerializeOptions({ type: NftInfoDto })
  getTokenInfo(
    @Param('chain') chain: Chain,
    @Param('nftAddress') nftAddress: string,
  ): Promise<NftInfo> {
    return this.nft.getNftInfo(chain, nftAddress);
  }
}
