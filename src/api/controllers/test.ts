import { NextFunction, Request, Response } from "express";
import { GetProviderQuotesRequest, toDtoQuotes } from "../../typeValidation/model/ProviderQuotesRequest";
import { ProviderQuotes } from "../../typeValidation/types";
import { ValidateeProviderQuotesRequest } from "../../typeValidation/validation";
import { fetchMercuryoQuote, fetchMoonpayQuote, fetchTransakQuote } from "../quoterFetchers";

type ProviderQuoteInfo = {
      providerFee: number;
      networkFee: number;
      amount: number;
      quote: number;
      fiatCurrency: string;
      cryptoCurrency: string;
      provider: string;
      price: number;
      error?: string | undefined;
};

function convertQuoteToBase(usdAmount: number, etherPrice: number): number {
      return usdAmount / etherPrice;
}

function processProviderResponse(
      item: ProviderQuotes,
      fiatCurrency: string,
      cryptoCurrency: string,
      network: number
): ProviderQuoteInfo {
      if (item.code === "MoonPay" && !item.error && network !== 324) {
            const {
                  baseCurrencyAmount,
                  networkFeeAmount,
                  quoteCurrencyPrice,
                  feeAmount,
                  extraFeeAmount,
            } = item.result;
            const providerFee = feeAmount + extraFeeAmount;
            const totalFees = networkFeeAmount + providerFee;
            const currencyAmtMinusFees = baseCurrencyAmount - totalFees;
            const receivedEthAmount = convertQuoteToBase(currencyAmtMinusFees, quoteCurrencyPrice);

            return {
                  providerFee,
                  networkFee: networkFeeAmount,
                  amount: baseCurrencyAmount,
                  quote: receivedEthAmount,
                  fiatCurrency: fiatCurrency.toUpperCase(),
                  cryptoCurrency: cryptoCurrency.toUpperCase(),
                  provider: item.code,
                  price: item.result.quoteCurrencyPrice,
                  error: undefined,
            };
      }

      if (item.code === "Mercuryo" && !item.error) {
            const data = item.result;
            const totalFeeAmount = Number(data.fee[fiatCurrency.toUpperCase()]);
            const currencyAmtMinusFees = Number(data.fiat_amount) - totalFeeAmount;
            const receivedEthAmount = convertQuoteToBase(currencyAmtMinusFees, Number(data.rate));

            return {
                  providerFee: Number(data.fee[fiatCurrency.toUpperCase()]),
                  networkFee: 0,
                  amount: Number(data.fiat_amount),
                  quote: receivedEthAmount,
                  fiatCurrency: fiatCurrency.toUpperCase(),
                  cryptoCurrency: cryptoCurrency.toUpperCase(),
                  provider: item.code,
                  price: item.result.rate,
                  error: undefined,
            };
      }

      if (item.code === "Transak" && !item.error) {
            const data = item.result.response;
            const totalFeeAmount = Number(data.totalFee);
            const currencyAmtMinusFees = Number(data.fiatAmount) - totalFeeAmount;
            const receivedEthAmount = convertQuoteToBase(
                  currencyAmtMinusFees,
                  Number(1 / data.conversionPrice)
            );

            const pancakeFee = Number(data.feeBreakdown[1]?.value || 0);
            const providerFee = Number(data.feeBreakdown[0]?.value + pancakeFee || 0);
            const networkFee = Number(data.feeBreakdown[2]?.value || 0);

            return {
                  providerFee,
                  networkFee,
                  amount: Number(data.fiatAmount),
                  quote: receivedEthAmount,
                  fiatCurrency: fiatCurrency.toUpperCase(),
                  cryptoCurrency: cryptoCurrency.toUpperCase(),
                  provider: item.code,
                  price: 1 / data.marketConversionPrice,
                  error: undefined,
            };
      }

      return {
            providerFee: 0,
            networkFee: 0,
            amount: 0,
            quote: 0,
            fiatCurrency: fiatCurrency.toUpperCase(),
            cryptoCurrency: cryptoCurrency.toUpperCase(),
            provider: item.code,
            price: 0,
            error: item.code === "Transak" ? item.result.error.message : item.result.message,
      };
}

export const fetchProviderQuotes = async (req: Request, res: Response, next: NextFunction) => {
      const request: GetProviderQuotesRequest = toDtoQuotes(req.body);
      const validationResult = ValidateeProviderQuotesRequest(request);

      if (!validationResult.success) {
            throw new Error(validationResult.data as string);
      }

      const { fiatCurrency, cryptoCurrency, fiatAmount, network } = request;

      try {
            const responsePromises: Promise<ProviderQuotes>[] = [
                  fetchMoonpayQuote(fiatAmount, cryptoCurrency, fiatCurrency, network),
                  fetchMercuryoQuote(fiatCurrency, cryptoCurrency, fiatAmount, network),
                  fetchTransakQuote(fiatAmount, cryptoCurrency, fiatCurrency, network),
            ];

            const responses = await Promise.allSettled(responsePromises);

            const providerQuotes: ProviderQuotes[] = responses.reduce((accumulator, response) => {
                  if (response.status === "fulfilled") {
                        accumulator.push(
                              processProviderResponse(
                                    response.value,
                                    fiatCurrency,
                                    cryptoCurrency,
                                    network
                              )
                        );
                  }
                  return accumulator;
            }, []);

            return res.status(200).json({ result: providerQuotes });
      } catch (error) {
            next(error);
      }
};
