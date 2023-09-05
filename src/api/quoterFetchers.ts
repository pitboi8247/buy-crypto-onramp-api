import axios from 'axios';
import config from '../config/config';
import { chainIdToMercuryoNetworkId, chainIdToMoonPayNetworkId, chainIdToTransakNetworkId } from '../config/constants';

const TRANSAK_ENDPOINT = `https://api-stg.transak.com/api/v2`
const MOONPAY_EBDPOINT = `https://api.moonpay.com/v3/currencies/`;
const MERCURYO_ENDPOINT = `https://api.mercuryo.io/v1.6/widget/buy/rate`;


export async function fetchMoonpayQuote(fiatAmount: number, cryptoCurrency: string, fiatCurrency: string, network: number) {
  try {
    const baseCurrency = `${cryptoCurrency.toLowerCase()}${chainIdToMoonPayNetworkId[network]}`
    const response = await axios.get(
      `${MOONPAY_EBDPOINT}${baseCurrency}/buy_quote/?apiKey=${
        config.moonpayLiveKey
      }&baseCurrencyAmount=${fiatAmount}&&baseCurrencyCode=${fiatCurrency.toLowerCase()}`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );
    const result = response.data;
    return { code: 'MoonPay', result: result, error: false };
  } catch (error) {
    return { code: 'MoonPay', result: error.response.data, error: true };
  }
}

export async function fetchMercuryoQuote(
  fiatCurrency: string,
  cryptoCurrency: string,
  amount: string,
  network: number,
) {
  try {
    const response = await axios.get(
      `${MERCURYO_ENDPOINT}?from=${fiatCurrency.toUpperCase()}&to=${cryptoCurrency.toUpperCase()}&amount=${amount}&network=${chainIdToMercuryoNetworkId[network]}&widget_id=a9f3d282-db2d-4364-ae62-602c5000f003`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );
    const result = response.data.data;
    return { code: 'Mercuryo', result: result, error: false };
  } catch (error) {
    return { code: 'Mercuryo', result: error.response.data, error: true };
  }
}

export async function fetchTransakQuote(fiatAmount: number, cryptoCurrency: string, fiatCurrency: string, network: number) {
  try {
    const response = await axios.get(
      `${TRANSAK_ENDPOINT}/currencies/price?partnerApiKey=bf960e79-6d98-4fd0-823d-8409d290c346&fiatCurrency=${fiatCurrency.toUpperCase()}&cryptoCurrency=${cryptoCurrency.toUpperCase()}&network=${chainIdToTransakNetworkId[network]}&fiatAmount=${fiatAmount}&paymentMethod=credit_debit_card&isBuyOrSell=BUY`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );
    const result = response.data;
    return { code: 'Transak', result: result, error: false };
  } catch (error) {
    return { code: 'Transak', result: error.response.data, error: true };
  }
}

