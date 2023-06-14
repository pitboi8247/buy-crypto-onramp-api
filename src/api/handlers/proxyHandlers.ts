import { NextFunction, Request, Response } from 'express';
import { fetchBinanceConnectQuote, fetchMercuryoQuote, fetchMoonpayQuote } from '../quoterFetchers';
import { APIError } from '../../utils/APIError';
import { providerQuotesSchema } from '../../typeValidation/validation';

// to-do
export const fetchProviderQuotes = async (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;
  const { fiatCurrency, cryptoCurrency, fiatAmount } = req.body
  try {
    const validPayload = providerQuotesSchema.safeParse(payload);
    if (!validPayload.success) {
      throw new Error('payload has the incorrect shape. please check you types');
    }
    const result = await await fetchMercuryoQuote(fiatCurrency, cryptoCurrency, fiatAmount)
   

    return res.status(200).json({ result });
  } catch (error: any) {
    return next(new APIError(error.message, error?.reason, error?.status));
  }
};
