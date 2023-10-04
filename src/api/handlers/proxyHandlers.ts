import { NextFunction, Request, Response } from 'express';
import { APIError } from '../../utils/APIError';
import { fetchMercuryoAvailability, fetchMoonpayAvailability } from '../ipFetchers';
import { fetchMercuryoQuote, fetchMoonpayQuote, fetchTransakQuote } from '../quoterFetchers';
import { GetProviderQuotesRequest, toDtoQuotes } from '../../typeValidation/model/ProviderQuotesRequest';
import { ValidateUserIpRequest, ValidateeProviderQuotesRequest } from '../../typeValidation/validation';
import { ProviderQuotes } from '../../typeValidation/types';
import { GetUserIpRequest, toDtoUserIp } from '../../typeValidation/model/UserIpRequest';

function convertQuoteToBase(usdAmount: number, etherPrice: number): number {
  const ethAmount = usdAmount / etherPrice;
  return ethAmount;
}

export const fetchproviderQuotes = async (req: Request, res: Response) => {
  const request: GetProviderQuotesRequest = toDtoQuotes(req.body);
  const validationResult = ValidateeProviderQuotesRequest(request);

  if (!validationResult.success) {
    throw new Error(validationResult.data as string);
  }
  const { fiatCurrency, cryptoCurrency, fiatAmount, network } = request;

  const responsePromises: Promise<ProviderQuotes>[] = [
    fetchMoonpayQuote(fiatAmount, cryptoCurrency, fiatCurrency, network),
    fetchMercuryoQuote(fiatCurrency, cryptoCurrency, fiatAmount, network),
    fetchTransakQuote(fiatAmount, cryptoCurrency, fiatCurrency, network),
  ];
  const responses = await Promise.allSettled(responsePromises);

  const dataPromises: ProviderQuotes[] = responses
    .reduce((accumulator, response) => {
      if (response.status === 'fulfilled') {
        return [...accumulator, response.value];
      }
      console.error('Error fetching price quotes:', response.reason);
      return accumulator;
    }, [])
    .filter((item) => typeof item !== 'undefined');

  const providerQuotes = dataPromises.map((item: ProviderQuotes) => {
    if (item.code === 'MoonPay' && !item.error && Number(network) !== 324) {
      const { baseCurrencyAmount, networkFeeAmount, quoteCurrencyPrice, feeAmount, extraFeeAmount } = item.result;
      const providerFee = feeAmount + extraFeeAmount;
      let totalFees = networkFeeAmount + providerFee;
      const currencyAmtMinusFees = baseCurrencyAmount - totalFees;
      const receivedEthAmount = convertQuoteToBase(currencyAmtMinusFees, quoteCurrencyPrice);

      return {
        providerFee: providerFee,
        networkFee: networkFeeAmount,
        amount: baseCurrencyAmount,
        quote: receivedEthAmount,
        fiatCurrency: fiatCurrency.toUpperCase(),
        cryptoCurrency: cryptoCurrency.toUpperCase(),
        provider: item.code,
        price: item.result.quoteCurrencyPrice,
        noFee: convertQuoteToBase(baseCurrencyAmount, quoteCurrencyPrice),
      };
    }
    if (item.code === 'Mercuryo' && !item.error) {
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
        noFee: 0,
      };
    }
    if (item.code === 'Transak' && !item.error) {
      const data = item.result.response;
      const totalFeeAmount = Number(data.totalFee);
      const currencyAmtMinusFees = Number(data.fiatAmount) - totalFeeAmount;
      const receivedEthAmount = convertQuoteToBase(currencyAmtMinusFees, Number(1 / data.conversionPrice));

      return {
        providerFee: Number(data.feeBreakdown[0].value),
        networkFee: Number(data.feeBreakdown[1].value),
        amount: Number(data.fiatAmount),
        quote: receivedEthAmount,
        fiatCurrency: fiatCurrency.toUpperCase(),
        cryptoCurrency: cryptoCurrency.toUpperCase(),
        provider: item.code,
        price: (1 / data.marketConversionPrice) * 1.0046,
        noFee: 0,
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
      noFee: 0,
      error: item.code === 'Transak' ? item.result.error.message : item.result.message,
    };
  });

  return res.status(200).json({ result: providerQuotes });
};

export const fetchProviderAvailability = async (req: Request, res: Response) => {
  const request: GetUserIpRequest = toDtoUserIp(req.body);
  const validationResult = ValidateUserIpRequest(request);

  if (!validationResult.success) {
    throw new Error(validationResult.data as string);
  }

  const { userIp } = request;
  const responsePromises: Promise<ProviderQuotes>[] = [
    fetchMoonpayAvailability(userIp),
    fetchMercuryoAvailability(userIp),
  ];
  const responses = await Promise.allSettled(responsePromises);

  const dataPromises: ProviderQuotes[] = responses
    .reduce((accumulator, response) => {
      if (response.status === 'fulfilled') {
        return [...accumulator, response.value];
      }
      console.error('Error fetching price quotes:', response.reason);
      return accumulator;
    }, [])
    .filter((item) => typeof item !== 'undefined');

  let availabilityMapping: { [provider: string]: boolean } = {};
  dataPromises.forEach((item) => {
    if (item.code === 'MoonPay' && !item.error) availabilityMapping[item.code] = true; //item.result.isAllowed;
    else if (item.code === 'Mercuryo' && !item.error)
      availabilityMapping[item.code] = true; //item.result.country.enabled;
    else availabilityMapping[item.code] = true;
  });
  availabilityMapping['Transak'] = true;
  return res.status(200).json({ result: availabilityMapping });
};

export const fetchMoonPayIpAvailability = async (req: Request, res: Response, next: NextFunction) => {
  const request: GetUserIpRequest = toDtoUserIp(req.body);
  const validationResult = ValidateUserIpRequest(request);

  if (!validationResult.success) {
    throw new Error(validationResult.data as string);
  }
  const {userIp} = request;
  try {
    const result = await fetchMoonpayAvailability(userIp);
    return res.status(200).json({ result });
  } catch (error: any) {
    return next(new APIError(error.message, error?.reason, error?.status));
  }
};

export const fetchMercuryoIpAvailability = async (req: Request, res: Response, next: NextFunction) => {
  const request: GetUserIpRequest = toDtoUserIp(req.body);
  const validationResult = ValidateUserIpRequest(request);

  if (!validationResult.success) {
    throw new Error(validationResult.data as string);
  }
  const {userIp} = request;
  try {
    const result = await fetchMercuryoAvailability(userIp);
    return res.status(200).json({ result });
  } catch (error: any) {
    return next(new APIError(error.message, error?.reason, error?.status));
  }
};
