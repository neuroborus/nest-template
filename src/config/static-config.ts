import * as dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const logLevel = process.env.LOG_LEVEL
  ? process.env.LOG_LEVEL.toLowerCase()
  : 'info';

if (!process.env.MULTICALL_ADDRESS) {
  throw new Error('MULTICALL_ADDRESS environment variable is not set');
}
const multicallAddress = process.env.MULTICALL_ADDRESS;

if (!process.env.RPC_URL) {
  throw new Error('RPC_URL environment variable is not set');
}
const rpcUrl = process.env.RPC_URL;

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
