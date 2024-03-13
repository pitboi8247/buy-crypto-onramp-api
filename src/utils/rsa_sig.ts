import crypto from "node:crypto";
import type { GetProviderSigRequest } from "../typeValidation/model/ProxiedSigRequest";
import config from "../config/config";
import {
      MERCURYO_PROD_URL,
      MERCURYO_TEST_URL,
      TRANSAK_PROD_URL,
      TRANSAK_TEST_URL,
} from "../config/constants";

export function sign(srcData: string, privateKey: string): string {
      const key = crypto.createPrivateKey(privateKey);
      const signer = crypto.createSign("RSA-SHA256");
      signer.update(srcData);
      const signature = signer.sign(key);
      return signature.toString("base64");
}

export const generateHMAC = (secretKey: string, message: string) => {
      return crypto.createHmac("sha256", secretKey).update(message).digest("hex");
};

export const populateMoonPayUrlLegacy = (moonPayParams: any) => {
      return `&theme=light&colorCode=%2382DBE3&lockAmount=true&currencyCode=${moonPayParams.defaultCurrencyCode.toLowerCase()}&baseCurrencyCode=${moonPayParams.baseCurrencyCode.toLowerCase()}&baseCurrencyAmount=${
            moonPayParams.baseCurrencyAmount
      }&walletAddress=${moonPayParams.walletAddress}`;
};

export const populateMoonPayUrl = (moonPayParams: GetProviderSigRequest) => {
      return `&theme=light&colorCode=%2382DBE3&lockAmount=true&currencyCode=${moonPayParams.cryptoCurrency.toLowerCase()}&baseCurrencyCode=${moonPayParams.fiatCurrency.toLowerCase()}&baseCurrencyAmount=${
            moonPayParams.amount
      }&externalTransactionId=${moonPayParams.externalTransactionId}&walletAddress=${
            moonPayParams.walletAddress
      }&redirectURL=`;
};

export const populateTransakUrl = (transakParams: GetProviderSigRequest) => {
      return `${config.env === "development" ? TRANSAK_TEST_URL : TRANSAK_PROD_URL}/?apiKey=${
            config.env === "development" ? config.transakTestApiKey : config.transakProdApiKey
      }&fiatCurrency=${transakParams.fiatCurrency}&cryptoCurrencyCode=${
            transakParams.cryptoCurrency
      }&network=${transakParams.network}&fiatAmount=${transakParams.amount}&walletAddress=${
            transakParams.walletAddress
      }&themeColor=1DC7D3&partnerOrderId=${transakParams.externalTransactionId}`;
};

export const populateMercuryoUrl = (mercuryoParams: GetProviderSigRequest) => {
      return `${config.env === "development" ? MERCURYO_TEST_URL : MERCURYO_PROD_URL}/?widget_id=${
            config.env === "development" ? config.mercuryoTestWidgetId : config.mercuryoProdWidgetId
      }&fiat_currency=${mercuryoParams.fiatCurrency}&currency=${
            mercuryoParams.cryptoCurrency
      }&fiat_amount=${
            mercuryoParams.amount
      }&fix_amount=true&fix_fiat_amount=true&fix_fiat_currency=true&fix_currency=true&network=${
            mercuryoParams.network
      }&wallet_address=${mercuryoParams.walletAddress}&merchant_transaction_id=${
            mercuryoParams.externalTransactionId
      }`;
};
