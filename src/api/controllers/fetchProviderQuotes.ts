import { NextFunction, Request, Response } from "express";
import { GetProviderQuotesRequest, toDtoQuotes } from "../../typeValidation/model/ProviderQuotesRequest";
import { ProviderQuotes } from "../../typeValidation/types";
import { ValidateeProviderQuotesRequest } from "../../typeValidation/validation";
import {
      fetchMercuryoQuote,
      fetchMercuryoQuoteSell,
      fetchMoonpayQuote,
      fetchTransakQuote,
} from "../quoterFetchers";
import { convertQuoteToBase } from "../../utils/utils";

export const fetchproviderQuotes = async (req: Request, res: Response, next: NextFunction) => {
      const request = req.body; // GetProviderQuotesRequest = toDtoQuotes(req.body);
      // const validationResult = ValidateeProviderQuotesRequest(request);

      // if (!validationResult.success) {
      //       throw new Error(validationResult.data as string);
      // }
      const { fiatCurrency, cryptoCurrency, fiatAmount, network } = request as any;
      const isFiat = true;
      console.log(isFiat);
      try {
            const responsePromises: Promise<ProviderQuotes>[] = [
                  fetchMoonpayQuote(fiatAmount, cryptoCurrency, fiatCurrency, network, isFiat),
                  isFiat
                        ? fetchMercuryoQuote(fiatCurrency, cryptoCurrency, fiatAmount, network)
                        : fetchMercuryoQuoteSell(fiatCurrency, cryptoCurrency, fiatAmount, network),
                  fetchTransakQuote(fiatAmount, cryptoCurrency, fiatCurrency, network, isFiat),
            ];
            const responses = await Promise.allSettled(responsePromises);

            const dataPromises: ProviderQuotes[] = responses.reduce((accumulator, response) => {
                  if (response.status === "fulfilled") {
                        return [...accumulator, response.value];
                  }
                  return accumulator;
            }, []);

            const providerQuotes = dataPromises.map((item: ProviderQuotes) => {
                  if (item.code === "MoonPay" && !item.error && Number(network) !== 324) {
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
                        const receivedEthAmount = convertQuoteToBase(
                              currencyAmtMinusFees,
                              quoteCurrencyPrice
                        );

                        return {
                              providerFee: providerFee,
                              networkFee: networkFeeAmount,
                              amount: isFiat ? baseCurrencyAmount : receivedEthAmount,
                              quote: isFiat ? receivedEthAmount : baseCurrencyAmount,
                              fiatCurrency: fiatCurrency.toUpperCase(),
                              cryptoCurrency: cryptoCurrency.toUpperCase(),
                              provider: item.code,
                              price: item.result.quoteCurrencyPrice,
                        };
                  }
                  if (item.code === "Mercuryo" && !item.error) {
                        const data = item.result;
                        console.log(item.result);
                        const totalFeeAmount = Number(
                              !isFiat ? data.fee : data.fee[fiatCurrency.toUpperCase()]
                        );
                        const currencyAmtMinusFees = Number(data.fiat_amount) - totalFeeAmount;
                        const receivedEthAmount = convertQuoteToBase(
                              currencyAmtMinusFees,
                              Number(data.rate)
                        );

                        return {
                              providerFee: totalFeeAmount,
                              networkFee: 0,
                              amount: isFiat ? Number(data.fiat_amount) : receivedEthAmount,
                              quote: isFiat ? receivedEthAmount : Number(data.fiat_amount),
                              fiatCurrency: fiatCurrency.toUpperCase(),
                              cryptoCurrency: cryptoCurrency.toUpperCase(),
                              provider: item.code,
                              price: Number(item.result.rate),
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
                              amount: isFiat ? Number(data.fiatAmount) : receivedEthAmount,
                              quote: isFiat ? receivedEthAmount : Number(data.fiatAmount),
                              fiatCurrency: fiatCurrency.toUpperCase(),
                              cryptoCurrency: cryptoCurrency.toUpperCase(),
                              provider: item.code,
                              price: 1 / data.marketConversionPrice,
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
            });

            console.log(providerQuotes);
            return res.status(200).json({ result: providerQuotes });
      } catch (error) {
            next(error);
      }
};
