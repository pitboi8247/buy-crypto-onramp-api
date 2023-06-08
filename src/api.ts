import app from './app';
import { Request, Response } from 'express';

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
import { BINANCE_CONNECT_API_URL, BINANCE_CONNECT_URL, MOONPAY_URL } from 'config/constants';

app.get('/', (req, res) => {
  res.status(200).send({ result: 'ok' });
});

app.post('/generate-mercuryo-sig', async (req: Request, res: Response) => {
  const queryString = qs.stringify(req.body);
  const queryParsed = qs.parse(queryString);
  const parsed = zQuery.safeParse(queryParsed);

  if (parsed.success === false) {
    return res.status(400).json({ message: 'Invalid query', reason: parsed.error });
  }
  const { walletAddress } = parsed.data;
  const signature = crypto.createHmac('sha512', `${walletAddress}${process.env.MERCURYO_SECRET_KEY}`);

  return res.json({ signature });
});

app.post('/generate-moonpay-sig', async (req: Request, res: Response) => {
  try {
    const queryString = qs.stringify(req.body);
    const queryParsed = qs.parse(queryString);
    const parsed = zQueryMoonPay.safeParse(queryParsed);

    if (!parsed.success) {
      throw new Error('Invalid query');
    }

    const { walletAddresses } = parsed.data;
    const encodedWalletAddresses = walletAddresses.replace(/[{:},"]/g, (m: string) => chars[m]);

    const moonPayTradeUrl = populateMoonPayUrl({ ...parsed.data, encodedWalletAddresses });
    const originalUrl = `${MOONPAY_URL}${moonPayTradeUrl}`;

    const signature = crypto
      .createHmac('sha256', process.env.MOONPAY_TEST_SECRET_KEY || '')
      .update(new URL(originalUrl).search)
      .digest('base64');

    const returnData = `${originalUrl}&signature=${encodeURIComponent(signature)}`;

    res.json({ urlWithSignature: returnData });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Bad Request' });
  }
});

app.post(
  '/generate-bsc-sig',
  // requireQueryParams(["walletAddress"]),
  async (req: Request, res: Response) => {
    try {
      const payload = req.body;
      if (!payload) {
        throw new Error('Payload is required.');
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
      res.status(400).json({ error: error.message || 'Bad Request' });
    }
  },
);

app.post('/fetch-bsc-quote', requireQueryParams(['walletAddress']), async (req: Request, res: Response) => {
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
    res.status(400).json({ error: error.message || 'Bad Request' });
  }
});

app.post('/fetch-bsc-availability', requireQueryParams(['walletAddress']), async (req: Request, res: Response) => {
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
    res.status(400).json({ error: error.message || 'Bad Request' });
  }
});
