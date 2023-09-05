import config from './config';

export const MOONPAY_URL = `https://buy.moonpay.com?apiKey=${config.moonpayLiveKey}`;
export const MOONPAY_TEST_URL = `https://buy-sandbox.moonpay.com?apiKey=pk_test_1Ibe44lMglFVL8COOYO7SEKnIBrzrp54`;
export const BINANCE_CONNECT_URL = 'https://www.binancecnt.com/en/pre-connect';

export enum ChainId {
  ETHEREUM = 1,
  GOERLI = 5,
  BSC = 56,
  BSC_TESTNET = 97,
  ZKSYNC_TESTNET = 280,
  ZKSYNC = 324,
  POLYGON_ZKEVM = 1101,
  POLYGON_ZKEVM_TESTNET = 1442,
  ARBITRUM_ONE = 42161,
  ARBITRUM_GOERLI = 421613,
  LINEA = 59144,
  LINEA_TESTNET = 59140,
  BASE = 8453,
}

export const chainIdToMercuryoNetworkId: { [id: number]: string } = {
  [ChainId.ETHEREUM]: 'ETHEREUM',
  [ChainId.BSC]: 'BINANCESMARTCHAIN',
  [ChainId.ARBITRUM_ONE]: 'ARBITRUM',
  [ChainId.ZKSYNC]: 'ZKSYNC',
  [ChainId.POLYGON_ZKEVM]: 'ZKEVM',
  [ChainId.LINEA]: 'LINEA',
  [ChainId.BASE]: 'LINEA',
};

export const chainIdToMoonPayNetworkId: { [id: number]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.BSC]: '_bsc',
  [ChainId.ARBITRUM_ONE]: '_arbitrum',
  [ChainId.ZKSYNC]: '_zksync',
  [ChainId.POLYGON_ZKEVM]: '_polygonzkevm',
  [ChainId.LINEA]: '_linea',
  [ChainId.BASE]: '_base',
};

export const chainIdToTransakNetworkId: { [id: number]: string } = {
  [ChainId.ETHEREUM]: 'ethereum',
  [ChainId.BSC]: 'bsc',
  [ChainId.ARBITRUM_ONE]: 'arbitrum',
  [ChainId.ZKSYNC]: 'zksync',
  [ChainId.POLYGON_ZKEVM]: 'polygonzkevm',
  [ChainId.LINEA]: 'linea',
  [ChainId.BASE]: 'base',
};
