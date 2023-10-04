import { GetTransakPayUrlRequest } from 'typeValidation/model/TransakUrlRequest';
import config from '../config/config';
import crypto from 'crypto'
import { GetMoonPaySignedUrlRequest } from 'typeValidation/model/MoonpaySignedUrlRequest';

export function sign(srcData: string, privateKey: string): string {
    const key = crypto.createPrivateKey(privateKey);
    const signer = crypto.createSign("RSA-SHA256");
    signer.update(srcData);
    const signature = signer.sign(key);
    return signature.toString("base64");
}

export const generateHMAC = (secretKey: string, message: string) => {
  return crypto.createHmac("sha256", secretKey).update(message).digest("hex");
}

export const populateMoonPayUrl = (moonPayParams: GetMoonPaySignedUrlRequest) => {
  return `&theme=${moonPayParams.theme}&colorCode=%2382DBE3&lockAmount=true&currencyCode=${moonPayParams.defaultCurrencyCode}&baseCurrencyCode=${moonPayParams.baseCurrencyCode}&baseCurrencyAmount=${moonPayParams.baseCurrencyAmount}&walletAddress=${moonPayParams.walletAddress}`;
}

export const populateTransakUrl = (transakParams: GetTransakPayUrlRequest) => {
  const transakApiKey = config.transakApiKey
  return `https://global.transak.com?apiKey=${transakApiKey}=${transakParams.fiatCurrency}&cryptoCurrencyCode=${transakParams.cryptoCurrency}&network=${transakParams.network}&fiatAmount=${transakParams.amount}&walletAddress=${transakParams.walletAddress}&themeColor=1DC7D3`;
}