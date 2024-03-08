import axios from "axios";
import config from "../config/config";
import {
      chainIdToMercuryoNetworkId,
      chainIdToMoonPayNetworkId,
      chainIdToTransakNetworkId,
} from "../config/constants";
import { ProviderQuotes } from "../typeValidation/types";
import { App } from "../app";

const TRANSAK_ENDPOINT = `https://api.transak.com/api/v2`;
const MOONPAY_EBDPOINT = `https://api.moonpay.com/v3/currencies/`;
const MERCURYO_ENDPOINT = `https://api.mercuryo.io/v1.6/widget/buy/rate`;

export async function fetchMoonpayQuote(
      fiatAmount: number,
      cryptoCurrency: string,
      fiatCurrency: string,
      network: number,
      isFiat: boolean
): Promise<ProviderQuotes> {
      const amountQueryParam = isFiat
            ? `baseCurrencyAmount=${fiatAmount}`
            : `quoteCurrencyAmount=${fiatAmount}`;

      try {
            const baseCurrency = `${cryptoCurrency.toLowerCase()}${chainIdToMoonPayNetworkId[network]}`;
            const response = await axios.get(
                  `${MOONPAY_EBDPOINT}${baseCurrency}/buy_quote/?apiKey=${
                        config.moonpayProdApiKeyKey
                  }&${amountQueryParam}&baseCurrencyCode=${fiatCurrency.toLowerCase()}`,
                  {
                        headers: {
                              Accept: "application/json",
                              "Content-Type": "application/json",
                        },
                  }
            );
            const result = response.data;
            return { code: "MoonPay", result: result, error: false };
      } catch (error) {
            App.log.error(`Error fetching moonpay quotes: ${JSON.stringify(error.response.data)}`);
            return { code: "MoonPay", result: error.response.data, error: true };
      }
}

export async function fetchMercuryoQuote(
      fiatCurrency: string,
      cryptoCurrency: string,
      amount: number,
      network: number
): Promise<ProviderQuotes> {
      try {
            const response = await axios.get(
                  `${MERCURYO_ENDPOINT}?from=${fiatCurrency.toUpperCase()}&to=${cryptoCurrency.toUpperCase()}&amount=${amount}&network=${
                        chainIdToMercuryoNetworkId[network]
                  }&widget_id=${config.mercuryoProdWidgetId}`,
                  {
                        headers: {
                              Accept: "application/json",
                              "Content-Type": "application/json",
                        },
                  }
            );
            const result = response.data.data;
            return { code: "Mercuryo", result: result, error: false };
      } catch (error) {
            App.log.error(`Error fetching Mercuryo quotes: ${JSON.stringify(error.response.data)}`);
            return { code: "Mercuryo", result: error.response.data, error: true };
      }
}

export async function fetchMercuryoQuoteSell(
      fiatCurrency: string,
      cryptoCurrency: string,
      amount: number,
      network: number
): Promise<ProviderQuotes> {
      try {
            const response = await axios.get(
                  `https://api.mercuryo.io/v1.6/public/convert?from=${cryptoCurrency.toUpperCase()}&type=sell&to=${fiatCurrency.toUpperCase()}&amount=${amount}&network=${
                        chainIdToMercuryoNetworkId[network]
                  }&widget_id=${config.mercuryoProdWidgetId}`,
                  {
                        headers: {
                              Accept: "application/json",
                              "Content-Type": "application/json",
                        },
                  }
            );
            const result = response.data.data;
            return { code: "Mercuryo", result: result, error: false };
      } catch (error) {
            App.log.error(`Error fetching Mercuryo quotes: ${JSON.stringify(error.response.data)}`);
            return { code: "Mercuryo", result: error.response.data, error: true };
      }
}

export async function fetchTransakQuote(
      fiatAmount: number,
      cryptoCurrency: string,
      fiatCurrency: string,
      network: number,
      isFiat: boolean
): Promise<ProviderQuotes> {
      const amountQueryParam = isFiat ? `fiatAmount=${fiatAmount}` : `cryptoAmount=${fiatAmount}`;
      try {
            const response = await axios.get(
                  `${TRANSAK_ENDPOINT}/currencies/price?partnerApiKey=${
                        config.transakProdApiKey
                  }&fiatCurrency=${fiatCurrency.toUpperCase()}&cryptoCurrency=${cryptoCurrency.toUpperCase()}&network=${
                        chainIdToTransakNetworkId[network]
                  }&${amountQueryParam}&paymentMethod=credit_debit_card&isBuyOrSell=BUY`,
                  {
                        headers: {
                              Accept: "application/json",
                              "Content-Type": "application/json",
                        },
                  }
            );
            const result = response.data;
            return { code: "Transak", result: result, error: false };
      } catch (error) {
            App.log.error(`Error fetching Transak quotes: ${JSON.stringify(error)}`);
            return { code: "Transak", result: error.response.data, error: true };
      }
}
