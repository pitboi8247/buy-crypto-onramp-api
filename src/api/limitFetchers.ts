import axios from "axios";
import type { ChainId } from "@pancakeswap/chains";
import {
      type LimitQuote,
      chainIdToMoonPayNetworkId,
      chainIdToTransakNetworkId,
      type BuyLimitResponse,
} from "../config/constants";
import toNumber from "lodash/toNumber";
import toUpper from "lodash/toUpper";
import type { ProviderQuotes } from "../typeValidation/types";
import config from "../config/config";

const MOONPAY_EBDPOINT = "https://api.moonpay.com/v3/currencies/";
const MERCURYO_ENDPOINT = "https://api.mercuryo.io/v1.6/widget/buy/rate";

export const fetchLimitOfMer = async (
      inputCurrencyId: string,
      outputCurrencyId: string
): Promise<ProviderQuotes> => {
      try {
            const response = await axios.get(
                  `${MERCURYO_ENDPOINT}?widget_id=${config.mercuryoProdWidgetId}&type=buy&from=${toUpper(
                        inputCurrencyId
                  )}&to=${toUpper(outputCurrencyId)}&amount=1`,
                  {
                        headers: {
                              Accept: "application/json",
                              "Content-Type": "application/json",
                        },
                  }
            );
            const limitQuote = response.data;

            if (limitQuote[toUpper(inputCurrencyId)] || limitQuote[toUpper(outputCurrencyId)]) {
                  return {
                        code: "Mercuryo",
                        result: "Base or Quote currency(s) not found",
                        error: true,
                  };
            }

            const result = {
                  baseCurrency: {
                        code: inputCurrencyId.toLowerCase(),
                        maxBuyAmount: toNumber(limitQuote[toUpper(inputCurrencyId)]?.max),
                        minBuyAmount: toNumber(limitQuote[toUpper(inputCurrencyId)]?.min),
                  },
                  quoteCurrency: {
                        code: outputCurrencyId.toUpperCase(),
                        maxBuyAmount: toNumber(limitQuote[toUpper(outputCurrencyId)]?.max),
                        minBuyAmount: toNumber(limitQuote[toUpper(outputCurrencyId)]?.min),
                  },
            };
            return { code: "Mercuryo", result, error: false };
      } catch (error) {
            return { code: "Mercuryo", result: "error.response.data", error: true };
      }
};

export const fetchLimitOfMoonpay = async (
      inputCurrencyId: string,
      outputCurrencyId: string,
      chainId: ChainId
): Promise<ProviderQuotes> => {
      try {
            const baseCurrency = `${outputCurrencyId.toLowerCase()}${
                  chainIdToMoonPayNetworkId[chainId]
            }`;
            const response = await axios.get(
                  `${MOONPAY_EBDPOINT}${baseCurrency}/limits?apiKey=${"pk_live_XtlA4L91XMYQyZ1wC9NFwqHWOMCPhQFD"}&baseCurrencyCode=${inputCurrencyId.toLowerCase()}&areFeesIncluded=true`,
                  {
                        headers: {
                              Accept: "application/json",
                              "Content-Type": "application/json",
                        },
                  }
            );

            const moonpayLimitQuote: BuyLimitResponse & {
                  paymentMethod: string;
                  areFeesIncluded: boolean;
            } = response.data;

            if (!moonpayLimitQuote.baseCurrency || !moonpayLimitQuote.quoteCurrency) {
                  return { code: "MoonPay", result: "Base or Quote currency(s) not found", error: true };
            }

            return {
                  code: "MoonPay",
                  result: {
                        baseCurrency: moonpayLimitQuote.baseCurrency,
                        quoteCurrency: moonpayLimitQuote.quoteCurrency,
                  },
                  error: false,
            };
      } catch (error) {
            return { code: "MoonPay", result: "error.response.data", error: true };
      }
};

export const fetchLimitOfTransak = async (
      inputCurrencyId: string,
      outputCurrencyId: string,
      chainId: ChainId
): Promise<ProviderQuotes> => {
      try {
            const response = await axios.get(
                  "https://api-stg.transak.com/api/v1/pricing/public/limits/BUY?apiKey=f2b85cf2-2ea5-4ca7-aaed-96c873066458",
                  {
                        headers: {
                              Accept: "application/json",
                              "Content-Type": "application/json",
                        },
                  }
            );

            const defaultPaymentType = "credit_debit_card";
            const transakLimitQuote = response.data;
            console.log(`${outputCurrencyId}${chainIdToTransakNetworkId[chainId]}`, inputCurrencyId);

            const limitQuote =
                  transakLimitQuote.response[`${outputCurrencyId}${chainIdToTransakNetworkId[chainId]}`][
                        inputCurrencyId
                  ][defaultPaymentType];

            console.log(limitQuote);

            const result = {
                  baseCurrency: {
                        code: inputCurrencyId.toUpperCase(),
                        maxBuyAmount: limitQuote.maxFiatAmount,
                        minBuyAmount: limitQuote.minFiatAmount,
                  },
                  quoteCurrency: {
                        code: outputCurrencyId.toUpperCase(),
                        maxBuyAmount: limitQuote.maxCryptoAmount,
                        minBuyAmount: limitQuote.minCryptoAmount,
                  },
            };
            console.log(result);

            return { code: "Transak", result, error: false };
      } catch (error) {
            return { code: "Transak", result: "error.response.data", error: true };
      }
};

export const getMinMaxAmountCap = (quotes: LimitQuote[]) => {
      return quotes.reduce((bestQuote: LimitQuote, quote: LimitQuote) => {
            if (!bestQuote) return quote;

            const baseCurrency = {
                  code: bestQuote.baseCurrency.code,
                  maxBuyAmount: Math.min(
                        bestQuote.baseCurrency.maxBuyAmount || 0,
                        quote.baseCurrency.maxBuyAmount || 0
                  ),
                  minBuyAmount: Math.max(
                        bestQuote.baseCurrency.minBuyAmount || 0,
                        quote.baseCurrency.minBuyAmount || 0
                  ),
            };

            const quoteCurrency = {
                  code: bestQuote.quoteCurrency.code,
                  maxBuyAmount: Math.min(
                        bestQuote.quoteCurrency.maxBuyAmount || 0,
                        quote.quoteCurrency.maxBuyAmount || 0
                  ),
                  minBuyAmount: Math.max(
                        bestQuote.quoteCurrency.minBuyAmount || 0,
                        quote.quoteCurrency.minBuyAmount || 0
                  ),
            };

            return {
                  baseCurrency,
                  quoteCurrency,
            };
      });
};
