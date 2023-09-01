import { NextFunction, Request, Response } from 'express';
import { APIError } from '../../utils/APIError';
import { fetchMercuryoAvailability, fetchMoonpayAvailability } from '../ipFetchers';
import { fetchMercuryoQuote, fetchMoonpayQuote } from '../quoterFetchers';

function convertQuoteToBase(usdAmount: number, etherPrice: number): number {
  const ethAmount = usdAmount / etherPrice;
  return ethAmount;
}

const MOONPAY_FEE = 0.02
const PANCAKE_FEE = 0.01
// to-do
export const fetchProviderQuotes = async (req: Request, res: Response, next: NextFunction) => {
  const { fiatCurrency, cryptoCurrency, fiatAmount, network } = req.body;

  const responsePromises = [
    fetchMoonpayQuote(fiatAmount, cryptoCurrency, fiatCurrency, network),
    fetchMercuryoQuote(fiatCurrency, cryptoCurrency, fiatAmount, network),
  ];
  const responses = await Promise.allSettled(responsePromises);

  const dataPromises = responses
    .reduce((accumulator, response) => {
      if (response.status === 'fulfilled') {
        return [...accumulator, response.value];
      }
      console.error('Error fetching price quotes:', response.reason);
      return accumulator;
    }, [])
    .filter((item) => typeof item !== 'undefined');

  const providerqUOTES = dataPromises.map((item) => {
    if (item.code === 'MoonPay' && !item.error) {
      const { baseCurrencyAmount, networkFeeAmount, quoteCurrencyPrice, feeAmount, extraFeeAmount } = item.result;
      const providerFee = feeAmount + extraFeeAmount
      let totalFees = networkFeeAmount + providerFee
      const currencyAmtMinusFees = baseCurrencyAmount - totalFees
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
        noFee: convertQuoteToBase(baseCurrencyAmount, quoteCurrencyPrice)
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
        noFee: 0
      
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
      noFee: 0
    };
  });

  return res.status(200).json({ result: providerqUOTES });
};

export const fetchProviderAvailability = async (req: Request, res: Response, next: NextFunction) => {
  const { userIp } = req.body;
  const responsePromises = [fetchMoonpayAvailability(userIp), fetchMercuryoAvailability(userIp)];
  const responses = await Promise.allSettled(responsePromises);

  const dataPromises = responses
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
    if (item.code === 'MoonPay' && !item.error) availabilityMapping[item.code] = item.result.isAllowed;
    else if (item.code === 'Mercuryo' && !item.error) availabilityMapping[item.code] = item.result.country.enabled;
    else availabilityMapping[item.code] = false;
  });
  return res.status(200).json({ result: availabilityMapping });
};

export const fetchMoonPayIpAvailability = async (req: Request, res: Response, next: NextFunction) => {
  const userIp = req.query.userIp.toString();
  try {
    const result = await fetchMoonpayAvailability(userIp);
    return res.status(200).json({ result });
  } catch (error: any) {
    return next(new APIError(error.message, error?.reason, error?.status));
  }
};

export const fetchMercuryoIpAvailability = async (req: Request, res: Response, next: NextFunction) => {
  const userIp = req.query.userIp.toString();
  try {
    const result = await fetchMercuryoAvailability(userIp);
    return res.status(200).json({ result });
  } catch (error: any) {
    return next(new APIError(error.message, error?.reason, error?.status));
  }
};
