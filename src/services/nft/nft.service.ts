import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { JsonRpcProvider } from 'ethers';
import { Chain } from 'ethers-tools';
import {
  MulticallFactory,
  AutoContractFactory,
  InjectMulticallFactory,
  InjectAutoContractFactory,
} from 'ethers-tools-nestjs';
import { NftInfo } from '@/entities/nft';

@Injectable()
export class NftService {
  constructor(
    private readonly config: ConfigService,
    @InjectPinoLogger(NftService.name)
    private readonly logger: PinoLogger,
    @InjectAutoContractFactory(NftService.name)
    private readonly nft: AutoContractFactory,
    @InjectMulticallFactory(NftService.name)
    private readonly multicall: MulticallFactory,
  ) {}

  public async getNftInfo(chain: Chain, nftAddress: string): Promise<NftInfo> {
    const driver: JsonRpcProvider = this.config.getOrThrow(
      `providers[${chain}]`,
    );
    const multicall = this.multicall.create({
      driver,
    });
    const contract = this.nft.create({
      address: nftAddress,
      driver,
    });

    multicall.addBatch([
      { call: contract.getNameCall() },
      { call: contract.getTotalMintCall() },
      { call: contract.getTotalSupplyCall() },
      { call: contract.getBaseTokenURICall() },
    ]);

    await multicall.run();

    const [name, totalMint, totalSupply, baseTokenURI] =
      multicall.getAllOrThrow<[string, bigint, bigint, string]>();

    const result: NftInfo = {
      name,
      totalMint: totalMint.toString(),
      totalSupply: totalSupply.toString(),
      baseTokenURI,
    };
    this.logger.trace('Retrieved nft: ', result);

    return result;
  }
}
