import { Chain } from 'ethers-tools';
import { JsonRpcProvider } from 'ethers';

const missEnv = (envName: string) => {
  return new Error(`Required ENV not found: ${envName}`);
};

const getRpc = (
  activeChains: Chain[],
  chain: Chain,
  env: string | undefined,
  envName: string,
): string | null => {
  if (activeChains.includes(chain)) {
    if (!env) throw missEnv(envName);
    return env;
  }
  return null;
};

export const getRpcProviders = (
  activeChains: Chain[],
): Partial<Record<Chain, JsonRpcProvider>> => {
  const ethereumUrl = getRpc(
    activeChains,
    Chain.Mainnet,
    process.env.JSON_RPC_ETHEREUM,
    'JSON_RPC_ETHEREUM',
  );
  const binanceUrl = getRpc(
    activeChains,
    Chain.BNBChain,
    process.env.JSON_RPC_BINANCE,
    'JSON_RPC_BINANCE',
  );
  const polygonUrl = getRpc(
    activeChains,
    Chain.Polygon,
    process.env.JSON_RPC_POLYGON,
    'JSON_RPC_POLYGON',
  );

  return {
    [Chain.Mainnet]: ethereumUrl ? new JsonRpcProvider(ethereumUrl) : undefined,
    [Chain.BNBChain]: binanceUrl ? new JsonRpcProvider(binanceUrl) : undefined,
    [Chain.Polygon]: polygonUrl ? new JsonRpcProvider(polygonUrl) : undefined,
  };
};
