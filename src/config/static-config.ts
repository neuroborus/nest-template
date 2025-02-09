import * as dotenv from 'dotenv';
dotenv.config();

const missEnvError = (envName) =>
  new Error(`Required ENV not found: ${envName}`);

const multicallAddress = process.env.MULTICALL_ADDRESS;
if (!multicallAddress) throw missEnvError('CONTRACT_ADDRESS');

const rpcUrl = process.env.RPC_URL;
if (!multicallAddress) throw missEnvError('RPC_URL');

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const logLevel = process.env.LOG_LEVEL
  ? process.env.LOG_LEVEL.toLowerCase()
  : 'info';

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
