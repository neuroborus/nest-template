import * as dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const logLevel = process.env.LOG_LEVEL
  ? process.env.LOG_LEVEL.toLowerCase()
  : 'info';

const multicallAddress = process.env.MULTICALL_ADDRESS
  ? process.env.MULTICALL_ADDRESS
  : '0xcA11bde05977b3631167028862bE2a173976CA11';

const rpcUrl = process.env.RPC_URL
  ? process.env.RPC_URL
  : 'https://eth.llamarpc.com';

/*
 This configuration is used directly only when dependency injection is not working,
 e.g. during application startup and its setup.
 Also, it fulfills dynamic (dependency-injection-based, main) configuration.
 */
export const staticConfig = {
  port,
  logLevel,
  multicallAddress,
  rpcUrl,
};
