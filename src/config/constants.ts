import config from "./config";
import { ChainId } from "@pancakeswap/chains";

export const MOONPAY_URL = `https://buy.moonpay.com?apiKey=${config.moonpayLiveKey}`;
export const MOONPAY_TEST_URL = `https://buy-sandbox.moonpay.com?apiKey=pk_test_1Ibe44lMglFVL8COOYO7SEKnIBrzrp54`;
export const TRANSAK_URL = `https://global.transak.com?apiKey=${config.transakApiKey}`;

export const TRANSAK_ENDPOINT = `https://api.transak.com/api/v2`;
export const MOONPAY_EBDPOINT = `https://api.moonpay.com/v3/currencies/`;
export const MERCURYO_ENDPOINT = `https://api.mercuryo.io/v1.6/widget/buy/rate`;

export const chainIdToMercuryoNetworkId: { [id: number]: string } = {
      [ChainId.ETHEREUM]: "ETHEREUM",
      [ChainId.BSC]: "BINANCESMARTCHAIN",
      [ChainId.ARBITRUM_ONE]: "ARBITRUM",
      [ChainId.ZKSYNC]: "ZKSYNC",
      [ChainId.POLYGON_ZKEVM]: "ZKEVM",
      [ChainId.LINEA]: "LINEA",
      [ChainId.BASE]: "LINEA",
};

export const chainIdToMoonPayNetworkId: { [id: number]: string } = {
      [ChainId.ETHEREUM]: "",
      [ChainId.BSC]: "_bsc",
      [ChainId.ARBITRUM_ONE]: "_arbitrum",
      [ChainId.ZKSYNC]: "_zksync",
      [ChainId.POLYGON_ZKEVM]: "_polygonzkevm",
      [ChainId.LINEA]: "_linea",
      [ChainId.BASE]: "_base",
};

export const chainIdToTransakNetworkId: { [id: number]: string } = {
      [ChainId.ETHEREUM]: "ethereum",
      [ChainId.BSC]: "bsc",
      [ChainId.ARBITRUM_ONE]: "arbitrum",
      [ChainId.ZKSYNC]: "zksync",
      [ChainId.POLYGON_ZKEVM]: "polygonzkevm",
      [ChainId.LINEA]: "linea",
      [ChainId.BASE]: "base",
};
