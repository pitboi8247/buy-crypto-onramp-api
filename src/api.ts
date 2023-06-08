import app from './app';
import { NextFunction, Request, Response } from 'express';

import qs from 'qs';
import crypto from 'crypto';
import { post } from './services/axios';
import {
  bscQuotepayloadSchema,
  checkIpPayloadSchema,
  payloadSchema,
  requireQueryParams,
  zQuery,
  zQueryMoonPay,
} from './typeValidation/validation';
import { chars } from './typeValidation/types';
import { populatBuildTradeParams, populateMoonPayUrl, populate_GET_RequestSigContent, sign } from './utils/rsa_sig';
import { BINANCE_CONNECT_API_URL, BINANCE_CONNECT_URL, MOONPAY_URL } from './config/constants';
import errorHandler from './utils/errorHandler';
import { APIError } from './utils/APIError';


export const generateMercuryoSig = async (req: Request, res: Response, next: NextFunction) => {
  const queryString = qs.stringify(req.body);
  const queryParsed = qs.parse(queryString);
  const parsed = zQuery.safeParse(queryParsed);

  if (parsed.success === false) {
    return next(errorHandler.handleError(parsed.error))
  }
  const { walletAddress } = parsed.data;
  const signature = crypto.createHmac('sha512', `${walletAddress}${process.env.MERCURYO_SECRET_KEY}`);

  return res.json({ signature });
}

export const generateMoonPaySig = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryString = qs.stringify(req.body);
    const queryParsed = qs.parse(queryString);
    const parsed = zQueryMoonPay.safeParse(queryParsed);

    if (parsed.success === false) {
      return next(errorHandler.handleError(parsed.error))
    }

    const { walletAddresses } = parsed.data;
    const encodedWalletAddresses = walletAddresses.replace(/[{:},"]/g, (m: string) => chars[m]);

    const moonPayTradeUrl = populateMoonPayUrl({ ...parsed.data, encodedWalletAddresses });
    const originalUrl = `${MOONPAY_URL}${moonPayTradeUrl}`;

    const signature = crypto
      .createHmac('sha256',  'hd')
      .update(new URL(originalUrl).search)
      .digest('base64');

    const returnData = `${originalUrl}&signature=${encodeURIComponent(signature)}`;

    res.json({ urlWithSignature: returnData });
    
  } catch (error) {
    return next(
      new APIError(error.message, error?.reason, error?.status)
    )
  }
}

export const generateBinanceConnectSig = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body;
      if (!payload) {
        throw new Error(payload);
      }
      const validPayload = payloadSchema.safeParse(payload);
      if (!validPayload.success) {
        throw new Error('payload has the incorrect shape. please check you types');
      }
      const { walletAddress } = validPayload.data;

      const merchantCode = 'pancake_swap_test';
      const timestamp = Date.now().toString();

      const contentToSign = populate_GET_RequestSigContent(walletAddress, merchantCode, timestamp);
      const signature = sign(contentToSign, process.env.PRIVATE_KEY.replace(/\\n/g, '\n'));

      const buildTradeUrl = populatBuildTradeParams({ ...validPayload.data, merchantCode, timestamp, signature });
      const returnData = `${BINANCE_CONNECT_URL}${buildTradeUrl}}`;

      res.json({ urlWithSignature: returnData });
    } catch (error: any) {

      return next(
        new APIError(error.message, error?.reason, error?.status)
      )
    }
  }

export const fetchBscQuote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body;
    if (!payload) {
      throw new Error('Payload is required.');
    }
    const validPayload = bscQuotepayloadSchema.safeParse(payload);
    if (!validPayload.success) {
      throw new Error('payload has the incorrect shape. please check you types');
    }

    const merchantCode = 'pancake_swap_test';
    const timestamp = Date.now().toString();

    const payloadString = JSON.stringify(validPayload.data);
    const contentToSign = `${payloadString}&merchantCode=${merchantCode}&timestamp=${timestamp}`;

    const signature = sign(contentToSign, process.env.PRIVATE_KEY.replace(/\\n/g, '\n'));
    const endpoint = `${BINANCE_CONNECT_API_URL}/fiat/v1/public/open-api/connect/get-quote`;

    // NEED TO LOK UP API DOCS FOR RET TYPE WILL DO LATER
    post<any, any>(endpoint, payload, {
      headers: {
        'Content-Type': 'application/json',
        merchantCode,
        timestamp,
        'x-api-signature': signature,
      },
    })
      .then((response) => {
        res.status(response.status).json(response.data);
      })
      .catch((error) => {
        if (error.response) {
          res.status(error.response.status).json(error.response.data);
        } else {
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });
  } catch (error: any) {

    return next(
      new APIError(error.message, error?.reason, error?.status)
    )
  }
}

export const fetchBscAvailability = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body;
    if (!payload) {
      throw new Error('Payload is required.');
    }
    const validPayload = checkIpPayloadSchema.safeParse(payload);
    if (!validPayload.success) {
      throw new Error('payload has the incorrect shape. please check you types');
    }

    const merchantCode = 'pancake_swap_test';
    const timestamp = Date.now().toString();

    const payloadString = JSON.stringify(validPayload.data);
    const contentToSign = `${payloadString}&merchantCode=${merchantCode}&timestamp=${timestamp}`;

    const signature = sign(contentToSign, process.env.PRIVATE_KEY.replace(/\\n/g, '\n'));
    const endpoint = `${BINANCE_CONNECT_API_URL}/fiat/v1/public/open-api/connect/check-ip-address`;

    post<any, any>(endpoint, payload, {
      headers: {
        'Content-Type': 'application/json',
        merchantCode,
        timestamp,
        'x-api-signature': signature,
      },
    })
      .then((response) => {
        res.status(response.status).json(response.data);
      })
      .catch((error) => {
        if (error.response) {
          res.status(error.response.status).json(error.response.data);
        } else {
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });
  } catch (error: any) {

    return next(
      new APIError(error.message, error?.reason, error?.status)
    )
  }
}
