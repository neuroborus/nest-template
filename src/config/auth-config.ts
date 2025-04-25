import { missEnvError } from '@/config/miss-env.error';

import * as dotenv from 'dotenv';
dotenv.config();

const accessSecret = process.env.ACCESS_SECRET;
if (!accessSecret) throw missEnvError('ACCESS_SECRET');

const refreshSecret = process.env.REFRESH_SECRET;
if (!refreshSecret) throw missEnvError('REFRESH_SECRET');

export const authConfig = {
  authNonceTtlMs: 1000 * 60 * 5, // 5 min
  authNonceCreationDelayMs: 1000 * 60, // 1 min
  accessSecret,
  accessTokenTtlMs: 1000 * 60 * 60 * 24, // 1 day
  refreshSecret,
  refreshTokenTtlMs: 1000 * 60 * 60 * 24 * 7, // We are manually managing it, 7 days
};
