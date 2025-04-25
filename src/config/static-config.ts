import { authConfig } from '@/config/auth-config';
import { missEnvError } from '@/config/miss-env.error';

import * as dotenv from 'dotenv';
dotenv.config();

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
};
