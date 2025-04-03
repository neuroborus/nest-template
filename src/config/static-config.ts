import * as dotenv from 'dotenv';
import { Chain } from 'ethers-tools';
import { getRpcProviders } from './providers-config';
dotenv.config();

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const logLevel = process.env.LOG_LEVEL
  ? process.env.LOG_LEVEL.toLowerCase()
  : 'info';

export const activeChains = [Chain.Mainnet, Chain.BNBChain, Chain.Polygon]; // !:
const providers = getRpcProviders(activeChains);

/*
 This configuration is used directly only when dependency injection is not working,
 e.g. during application startup and its setup.
 Also, it fulfills dynamic (dependency-injection-based, main) configuration.
 */
export const staticConfig = {
  port,
  logLevel,
  activeChains,
  providers,
};
