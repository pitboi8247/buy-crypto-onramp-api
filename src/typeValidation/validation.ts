import { NextFunction, Request, Response } from "express";
import { string as zString, object as zObject } from "zod";

export const payloadSchema = zObject({
  walletAddress: zString(),
  cryptoCurrency: zString(),
  fiatCurrency: zString(),
  amount: zString(),
});

export const zQueryMoonPay = zObject({
  type: zString(),
  defaultCurrencyCode: zString(),
  redirectUrl: zString(),
  theme: zString(),
  walletAddresses: zString(),
  baseCurrencyCode: zString(),
  baseCurrencyAmount: zString(),
});

export const bscQuotepayloadSchema = zObject({
  fiatCurrency: zString(),
  cryptoCurrency: zString(),
  fiatAmount: zString(),
  cryptoNetwork: zString(),
  paymentMethod: zString(),
});

export const zQuery = zObject({
  walletAddress: zString(),
});


export const checkIpPayloadSchema = zObject({
    clientUserIp: zString(),
  })

export function requireQueryParams(params: Array<string>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const fails: string[] = [];
    for (const param of params) {
      if (!req.query[param]) {
        fails.push(param);
      }
    }
    if (fails.length > 0) {
      res.status(400).send(`${fails.join(",")} required`);
    } else {
      next();
    }
  };
}