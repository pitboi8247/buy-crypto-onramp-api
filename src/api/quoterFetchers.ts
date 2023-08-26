import axios from 'axios';
import config from '../config/config';

const MOONPAY_EBDPOINT = `https://api.moonpay.com/v3/currencies/`;
const MERCURYO_ENDPOINT = `https://api.mercuryo.io/v1.6/widget/buy/rate`;

const networkToChainMap = {
  ETHEREUM: '',
  BINANCESMARTCHAIN: '_bsc',
  ARBITRUM: '_arbitrum'
}
export async function fetchMoonpayQuote(fiatAmount: number, cryptoCurrency: string, fiatCurrency: string, network: string) {
  try {
    const baseCurrency = `${cryptoCurrency.toLowerCase()}${networkToChainMap[network]}`
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
  network: string,
) {
  try {
    const response = await axios.get(
      `${MERCURYO_ENDPOINT}?from=${fiatCurrency.toUpperCase()}&to=${cryptoCurrency.toUpperCase()}&amount=${amount}&network=${network}&widget_id=a9f3d282-db2d-4364-ae62-602c5000f003`,
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
