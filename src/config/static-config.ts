import 'dotenv/config';

const DEFAULT_PORT = 3000;
const rawPort = process.env.PORT;
const parsedPort = rawPort ? Number.parseInt(rawPort, 10) : Number.NaN;
const port =
  Number.isInteger(parsedPort) && parsedPort > 0 && parsedPort <= 65535
    ? parsedPort
    : DEFAULT_PORT;

const rawLogLevel = process.env.LOG_LEVEL?.trim();
const logLevel = rawLogLevel ? rawLogLevel.toLowerCase() : 'info';
import { NODE_ENV } from '@/entities/node-env';
import { authConfig } from './auth.config';
import { missEnvError } from './miss-env.error';

const nodeEnvStr = process.env.NODE_ENV;
if (!nodeEnvStr) throw missEnvError('NODE_ENV');
const envList = Object.values(NODE_ENV) as string[];

let nodeEnv: NODE_ENV;
if (nodeEnvStr === 'test') {
  nodeEnv = NODE_ENV.DEV;
} else if (!envList.includes(nodeEnvStr)) {
  throw new Error(
    `NODE_ENV must be one of the following values: ${JSON.stringify(envList)}\n` +
      `Provided: ${JSON.stringify(nodeEnvStr)}`,
  );
} else {
  nodeEnv = NODE_ENV[nodeEnvStr.toUpperCase() as keyof typeof NODE_ENV];
}

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const logLevel = process.env.LOG_LEVEL
  ? process.env.LOG_LEVEL.toLowerCase()
  : 'info';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw missEnvError('DATABASE_URL');

/*
 This configuration is used directly only when dependency injection is not working,
 e.g., during application startup and its setup.
 Also, it fulfills dynamic (dependency-injection-based, main) configuration.
 */
export const staticConfig = {
  port,
  logLevel,
  databaseUrl,
  auth: authConfig,
} as const;
