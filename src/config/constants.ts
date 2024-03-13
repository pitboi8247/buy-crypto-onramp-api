import config from "./config";
import { ChainId } from "@pancakeswap/chains";

export const MOONPAY_URL = `https://buy.moonpay.com?apiKey=${config.moonpayProdApiKeyKey}`;
export const MOONPAY_TEST_URL =
      "https://buy-sandbox.moonpay.com?apiKey=pk_test_1Ibe44lMglFVL8COOYO7SEKnIBrzrp54";
export const TRANSAK_PROD_URL = "https://global.transak.com";
export const TRANSAK_TEST_URL = "https://global-stg.transak.com";

export const TRANSAK_ENDPOINT = "https://api.transak.com/api/v2";
export const MOONPAY_EBDPOINT = "https://api.moonpay.com/v3/currencies/";
export const MERCURYO_ENDPOINT = "https://api.mercuryo.io/v1.6/widget/buy/rate";
export const MERCURYO_TEST_URL = "https://sandbox-exchange.mrcr.io";
export const MERCURYO_PROD_URL = "https://exchange.mercuryo.io";

export enum ONRAMP_PROVIDERS {
      MoonPay = "MoonPay",
      Mercuryo = "Mercuryo",
      Transak = "Transak",
}

export type SupportedProvider = keyof typeof ONRAMP_PROVIDERS;

export const chainIdToMercuryoNetworkId: { [id: number]: string } = {
      [ChainId.ETHEREUM]: "ETHEREUM",
      [ChainId.BSC]: "BINANCESMARTCHAIN",
      [ChainId.ARBITRUM_ONE]: "ARBITRUM",
      [ChainId.ZKSYNC]: "ZKSYNC",
      [ChainId.POLYGON_ZKEVM]: "ZKEVM",
      [ChainId.LINEA]: "LINEA",
      [ChainId.BASE]: "LINEA",
      0: "BITCOIN",
};

export const chainIdToMoonPayNetworkId: { [id: number]: string } = {
      [ChainId.ETHEREUM]: "",
      [ChainId.BSC]: "_bsc",
      [ChainId.ARBITRUM_ONE]: "_arbitrum",
      [ChainId.ZKSYNC]: "_zksync",
      [ChainId.POLYGON_ZKEVM]: "_polygonzkevm",
      [ChainId.LINEA]: "_linea",
      [ChainId.BASE]: "_base",
      0: "",
};

export const chainIdToTransakNetworkId: { [id: number]: string } = {
      [ChainId.ETHEREUM]: "ethereum",
      [ChainId.BSC]: "bsc",
      [ChainId.ARBITRUM_ONE]: "arbitrum",
      [ChainId.ZKSYNC]: "zksync",
      [ChainId.POLYGON_ZKEVM]: "polygonzkevm",
      [ChainId.LINEA]: "linea",
      [ChainId.BASE]: "base",
      0: "mainnet",
};

export const SUPPORTED_ONRAMP_TOKENS = ["ETH", "DAI", "USDT", "USDC", "BUSD", "BNB"];
export const DEFAULT_FIAT_CURRENCIES = [
      "USD",
      "EUR",
      "GBP",
      "HKD",
      "CAD",
      "AUD",
      "BRL",
      "JPY",
      "KRW",
      "VND",
];
export const WHITELISTED_FIAT_CURRENCIES_BASE = ["EUR", "GBP", "HKD", "CAD", "AUD", "JPY", "KRW", "VND"];
export const WHITELISTED_FIAT_CURRENCIES_LINEA = [
      "EUR",
      "GBP",
      "HKD",
      "CAD",
      "AUD",
      "JPY",
      "KRW",
      "VND",
];

const SUPPORTED_MERCURYO_BSC_TOKENS = ["BNB", "BUSD"];
const SUPPORTED_MERCURYO_ETH_TOKENS = ["ETH", "USDT", "DAI"];
const SUPPORTED_MERCURYO_ARBITRUM_TOKENS = ["ETH", "USDC"];

const SUPPORTED_MONPAY_ETH_TOKENS = ["ETH", "USDC", "DAI", "USDT"];
const SUPPORTED_MOONPAY_BSC_TOKENS = ["BNB", "BUSD"];
const SUPPORTED_MOONPAY_ARBITRUM_TOKENS = ["ETH", "USDC"];
const SUPPORTED_MOONPAY_ZKSYNC_TOKENS = ["ETH", "USDC", "DAI", "USDT"];

const SUPPORTED_TRANSAK_BSC_TOKENS = ["BNB", "BUSD"];
const SUPPORTED_TRANSAK_ETH_TOKENS = ["ETH", "USDT", "DAI"];
const SUPPORTED_TRANSAK_ARBITRUM_TOKENS = ["ETH", "USDC"];
const SUPPORTED_TRANSAK_LINEA_TOKENS = ["ETH", "USDC"];
const SUPPORTED_TRANSAK_ZKSYNC_TOKENS = ["ETH"];
const SUPPORTED_TRANSAK_ZKEVM_TOKENS = ["ETH"];
const SUPPORTED_TRANSAK_BASE_TOKENS = ["ETH", "USDC"];

export const CURRENT_CAMPAIGN_TIMESTAMP = 1694512859;

export enum FeeTypes {
      TotalFees = "Est. Total Fees",
      NetworkingFees = "Networking Fees",
      ProviderFees = "Provider Fees",
}

export const supportedTokenMap: {
      [chainId: number]: {
            [ONRAMP_PROVIDERS.MoonPay]: string[];
            [ONRAMP_PROVIDERS.Mercuryo]: string[];
            [ONRAMP_PROVIDERS.Transak]: string[];
      };
} = {
      [ChainId.BSC]: {
            [ONRAMP_PROVIDERS.MoonPay]: SUPPORTED_MOONPAY_BSC_TOKENS,
            [ONRAMP_PROVIDERS.Mercuryo]: SUPPORTED_MERCURYO_BSC_TOKENS,
            [ONRAMP_PROVIDERS.Transak]: SUPPORTED_TRANSAK_BSC_TOKENS,
      },
      [ChainId.ETHEREUM]: {
            [ONRAMP_PROVIDERS.MoonPay]: SUPPORTED_MONPAY_ETH_TOKENS,
            [ONRAMP_PROVIDERS.Mercuryo]: SUPPORTED_MERCURYO_ETH_TOKENS,
            [ONRAMP_PROVIDERS.Transak]: SUPPORTED_TRANSAK_ETH_TOKENS,
      },
      [ChainId.ARBITRUM_ONE]: {
            [ONRAMP_PROVIDERS.MoonPay]: SUPPORTED_MOONPAY_ARBITRUM_TOKENS,
            [ONRAMP_PROVIDERS.Mercuryo]: SUPPORTED_MERCURYO_ARBITRUM_TOKENS,
            [ONRAMP_PROVIDERS.Transak]: SUPPORTED_TRANSAK_ARBITRUM_TOKENS,
      },
      [ChainId.ZKSYNC]: {
            [ONRAMP_PROVIDERS.MoonPay]: SUPPORTED_MOONPAY_ZKSYNC_TOKENS,
            [ONRAMP_PROVIDERS.Mercuryo]: [],
            [ONRAMP_PROVIDERS.Transak]: SUPPORTED_TRANSAK_ZKSYNC_TOKENS,
      },
      [ChainId.LINEA]: {
            [ONRAMP_PROVIDERS.MoonPay]: [],
            [ONRAMP_PROVIDERS.Mercuryo]: [],
            [ONRAMP_PROVIDERS.Transak]: SUPPORTED_TRANSAK_LINEA_TOKENS,
      },
      [ChainId.POLYGON_ZKEVM]: {
            [ONRAMP_PROVIDERS.MoonPay]: [],
            [ONRAMP_PROVIDERS.Mercuryo]: [],
            [ONRAMP_PROVIDERS.Transak]: SUPPORTED_TRANSAK_ZKEVM_TOKENS,
      },
      [ChainId.BASE]: {
            [ONRAMP_PROVIDERS.MoonPay]: [],
            [ONRAMP_PROVIDERS.Mercuryo]: [],
            [ONRAMP_PROVIDERS.Transak]: SUPPORTED_TRANSAK_BASE_TOKENS,
      },
      // Add more chainId mappings as needed
};
export type LimitCurrency = {
      code: string;
      maxBuyAmount: number;
      minBuyAmount: number;
};

export type BuyLimitResponse = {
      baseCurrency: LimitCurrency;
      quoteCurrency: LimitCurrency;
};

export type CurrencyLimits = {
      code: string;
      maxBuyAmount: number;
      minBuyAmount: number;
};

export interface LimitQuote {
      baseCurrency: CurrencyLimits;
      quoteCurrency: CurrencyLimits;
}
