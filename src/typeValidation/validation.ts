import { NextFunction, Request, Response } from 'express';
import { string as zString, object as zObject } from 'zod';
import qs from 'qs';

type Options =
  | {
      method?: string;
      walletAddress: string;
      cryptoCurrency: string;
      fiatCurrency: string;
      amount: string;
    }
  | {
      method?: string;
      message?: string;
    };

export type SafeParseReturnType<U extends Options> = {
  data: U;
};

export type ParsedMercuryGet = SafeParseReturnType<{
  method?: string;
  walletAddress?: string;
}>;

export type ParsedMercuryPOST = SafeParseReturnType<{
  method?: string;
  message?: string;
}>;

export const payloadSchema = zObject({
  walletAddress: zString(),
  cryptoCurrency: zString(),
  fiatCurrency: zString(),
  amount: zString(),
});

export const zQueryMoonPay = zObject({
  type: zString(),
  amount: zString(),
  baseCurrencyCode: zString(),
  defaultCurrencyCode: zString(),
  redirectUrl: zString(),
  theme: zString(),
  walletAddress: zString(),
  showOnlyCurrencies: zString().array(),
});

export const mercuryoGET = zObject({
  walletAddress: zString(),
});

export const mercuryoPOST = zObject({
  message: zString(),
});

export const mercuryoSigningAPISchema = zObject({
  mercuryoGET,
  mercuryoPOST,
});

export const checkIpPayloadSchema = zObject({
  clientUserIp: zString(),
});

export const validateMercuryoSchema = (
  indexer: string,
  queryParsed: qs.ParsedQs,
  res: Response,
): ParsedMercuryGet | ParsedMercuryPOST | Response => {
  const parsed = mercuryoSigningAPISchema.shape[indexer].safeParse(queryParsed);
  if (parsed.success === false) return res.status(400).json({ success: false, message: JSON.stringify(queryParsed) });
  else return parsed;
};

export function requireQueryParams(params: Array<string>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const fails: string[] = [];
    for (const param of params) {
      if (!req.query[param]) {
        fails.push(param);
      }
    }
    if (fails.length > 0) {
      res.status(400).send(`${fails.join(',')} required`);
    } else {
      next();
    }
  };
}
