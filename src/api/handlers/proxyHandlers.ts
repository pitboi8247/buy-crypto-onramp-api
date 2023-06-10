import { NextFunction, Request, Response } from 'express';
import { fetchBinanceConnectQuote, fetchMercuryoQuote, fetchMoonpayQuote } from '../quoterFetchers';
import { APIError } from '../../utils/APIError';
import { providerQuotesSchema } from '../../typeValidation/validation';

// to-do
export const fetchProviderQuotes = async (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;
  try {
    const validPayload = providerQuotesSchema.safeParse(payload);
    if (!validPayload.success) {
      throw new Error('payload has the incorrect shape. please check you types');
    }
    const responsePromises = [
      await fetchMercuryoQuote('USD', 'BTCgr', 100),
      await fetchMoonpayQuote(100, 'usd', 'btc'),
      await fetchBinanceConnectQuote({}),
    ];
    const responses = await Promise.allSettled(responsePromises);

    return res.status(200).json({ responsePromises: responses });
  } catch (error: any) {
    return next(new APIError(error.message, error?.reason, error?.status));
  }
};
