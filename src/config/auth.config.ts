import { missEnvError } from './miss-env.error';

const accessSecret = process.env.ACCESS_SECRET;
if (!accessSecret) throw missEnvError('ACCESS_SECRET');

const refreshSecret = process.env.REFRESH_SECRET;
if (!refreshSecret) throw missEnvError('REFRESH_SECRET');

const siweDomain = process.env.SIWE_DOMAIN;
if (!siweDomain) throw missEnvError('SIWE_DOMAIN');

const siweUri = process.env.SIWE_URI || process.env.SIWE_ORIGIN;
if (!siweUri) throw missEnvError('SIWE_URI');

const parsePositiveInt = (
  value: string | undefined,
  fallback: number,
): number => {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const parseChainIds = (value: string | undefined): number[] => {
  if (!value) return [1];

  const chainIds = value
    .split(',')
    .map((item) => Number.parseInt(item.trim(), 10))
    .filter((item) => Number.isInteger(item) && item > 0);

  if (chainIds.length === 0) {
    throw new Error('SIWE_ALLOWED_CHAIN_IDS must contain at least one integer');
  }

  return [...new Set(chainIds)];
};

export const authConfig = {
  authNonceTtlMs: parsePositiveInt(
    process.env.SIWE_NONCE_TTL_MS,
    1000 * 60 * 5,
  ),
  siweDomain,
  siweUri,
  siweAllowedChainIds: parseChainIds(process.env.SIWE_ALLOWED_CHAIN_IDS),
  siweIssuedAtTtlMs: parsePositiveInt(
    process.env.SIWE_ISSUED_AT_TTL_MS,
    1000 * 60 * 5,
  ),
  siweClockSkewMs: parsePositiveInt(process.env.SIWE_CLOCK_SKEW_MS, 1000 * 30),
  accessSecret,
  accessTokenTtlMs: 1000 * 60 * 15, // 15 minutes
  refreshSecret,
  refreshTokenTtlMs: 1000 * 60 * 60 * 24 * 3, // We are manually managing it, 3 days
};
