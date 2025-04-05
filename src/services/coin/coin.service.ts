import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { JsonRpcProvider } from 'ethers';
import { Chain } from 'ethers-tools';
import {
  ContractFactory,
  MulticallFactory,
  InjectContractFactory,
  InjectMulticallFactory,
} from 'ethers-tools-nestjs';
import { Erc20Contract } from '@/contracts';
import { CoinInfo } from '@/entities/coin';

@Injectable()
export class CoinService {
  constructor(
    private readonly config: ConfigService,
    @InjectPinoLogger(CoinService.name)
    private readonly logger: PinoLogger,
    @InjectContractFactory(Erc20Contract)
    private readonly coin: ContractFactory<Erc20Contract>,
    @InjectMulticallFactory(CoinService.name)
    private readonly multicall: MulticallFactory,
  ) {}

  public async getCoinInfo(
    chain: Chain,
    tokenAddress: string,
    userAddress?: string,
  ): Promise<CoinInfo> {
    const driver: JsonRpcProvider = this.config.getOrThrow(
      `providers[${chain}]`,
    );
    const multicall = this.multicall.create({
      driver,
    });
    const contract = this.coin.create({
      address: tokenAddress,
      driver,
    });
    multicall.addBatch([
      { call: contract.getNameCall() },
      { call: contract.getSymbolCall() },
      { call: contract.getTotalSupplyCall() },
      { call: contract.getDecimalsCall() },
    ]);
    if (userAddress) multicall.add(contract.getBalancesCall(userAddress));

    await multicall.run();
    const [name, symbol, totalSupply, decimals, balances] =
      multicall.getAllOrThrow<
        [string, string, bigint, bigint, bigint | undefined]
      >();

    const result: CoinInfo = {
      name,
      symbol,
      totalSupply: totalSupply.toString(),
      decimals: Number(decimals),
      balances: balances?.toString(),
    };
    this.logger.trace('Retrieved coin: ', result);

    return result;
  }
}
