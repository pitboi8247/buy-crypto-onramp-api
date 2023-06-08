// require("dotenv").config({ path: ".env" })
import express, { NextFunction, Request, Response } from 'express';

import cors from 'cors';
import { config as envConfig } from 'dotenv';
import qs from 'qs';
import crypto from 'crypto';
import { APIError } from './utils/APIError';
import { post } from './services/axios';
import {
  bscQuotepayloadSchema,
  payloadSchema,
  requireQueryParams,
  zQuery,
  zQueryMoonPay,
} from './typeValidation/validation';
import { chars } from './typeValidation/types';
import { sign } from './utils/rsa_sig';
import config from './config/config';
import httpLogger from 'utils/httpLogger';
//need to put in config
const SIGNER = config.privateKey;
console.log(config.port);

envConfig();

const app = express();
const port = 5500;

app.use(express.json());
app.use(cors({ origin: '*' }));
app.use((err: APIError, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  err.status = err.status || 500;
  if (!(err instanceof APIError)) {
    err = new APIError((err as any).message, null, (err as any).status);
  }
  res.status(err.status).send(err.toJson());
});
app.use(httpLogger.successHandler);
app.use(httpLogger.errorHandler);
app.use(express.json());

// app.use((req, res, next) => {
//   res.status(404).send("Nothing here :)");
// });

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});

app.get('/', (req, res) => {
  res.status(200).send({ result: 'ok' });
});

app.post('/generate-mercuryo-sig', async (req: Request, res: Response) => {
  const queryString = qs.stringify(req.body);
  const queryParsed = qs.parse(queryString);
  const parsed = zQuery.safeParse(queryParsed);

  if (parsed.success === false) {
    return res
      .status(400)
      .json({ message: 'Invalid query', reason: parsed.error });
  }
  const { walletAddress } = parsed.data;
  const signature = crypto.createHmac(
    'sha512',
    `${walletAddress}${'9r8egtsb27bzr101em7uw7zhcrlwdbp'}`,
  );

  return res.json({ signature });
});

app.post(
  '/generate-moonpay-sig',
  async (req: Request, res: Response) => {
    try {
      const queryString = qs.stringify(req.body);
      const queryParsed = qs.parse(queryString);
      const parsed = zQueryMoonPay.safeParse(queryParsed);

      if (!parsed.success) {
        throw new Error('Invalid query');
      }

      const {
        walletAddresses,
        defaultCurrencyCode,
        baseCurrencyCode,
        baseCurrencyAmount,
        theme,
      } = parsed.data;

      const encodedWalletAddresses = walletAddresses.replace(
        /[{:},"]/g,
        (m: string) => chars[m],
      );
      const originalUrl = `${process.env.MOONPAY_URL}&theme=${theme}&colorCode=%2382DBE3&defaultCurrencyCode=${defaultCurrencyCode}&baseCurrencyCode=${baseCurrencyCode}&baseCurrencyAmount=${baseCurrencyAmount}&walletAddresses=${encodedWalletAddresses}`;

      const signature = crypto
        .createHmac('sha256', process.env.MOONPAY_TEST_SECRET_KEY || '')
        .update(new URL(originalUrl).search)
        .digest('base64');

      const returnData = `${originalUrl}&signature=${encodeURIComponent(
        signature,
      )}`;

      res.json({ urlWithSignature: returnData });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Bad Request' });
    }
  },
);

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
        throw new Error(
          'payload has the incorrect shape. please check you types',
        );
      }
      const { walletAddress, cryptoCurrency, fiatCurrency, amount } =
        validPayload.data;

      const merchantCode = 'pancake_swap_test';
      const timestamp = Date.now().toString();

      const contentToSign = `cryptoAddress=${walletAddress}&cryptoNetwork=ERC20&merchantCode=${merchantCode}&timestamp=${timestamp}`;
      const signature = sign(contentToSign, process.env.SIGNER);
      const returnData = `https://sandbox.bifinity.org/en/pre-connect?cryptoCurrency=${cryptoCurrency}&fiatCurrency=${fiatCurrency}&orderAmount=${amount}&cryptoAddress=${walletAddress}&cryptoNetwork=BNB&merchantCode=pancake_swap_test&timestamp=${timestamp}&signature=${signature}`;

      res.json({ urlWithSignature: returnData });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Bad Request' });
    }
  },
);

app.post(
  '/fetch-bsc-quote',
  requireQueryParams(['walletAddress']),
  async (req: Request, res: Response) => {
    try {
      const payload = req.body;
      if (!payload) {
        throw new Error('Payload is required.');
      }
      const validPayload = bscQuotepayloadSchema.safeParse(payload);
      if (!validPayload.success) {
        throw new Error(
          'payload has the incorrect shape. please check you types',
        );
      }

      const merchantCode = 'pancake_swap_test';
      const timestamp = Date.now().toString();

      const payloadString = JSON.stringify(validPayload.data);
      const contentToSign = `${payloadString}&merchantCode=${merchantCode}&timestamp=${timestamp}`;
      const signature = sign(contentToSign, SIGNER);
      const endpoint =
        'https://sandbox.bifinitypay.com/bapi/fiat/v1/public/open-api/connect/get-quote';

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
  },
);

// export default function handler(req: Request, res: Response): void {
//   try {
//     const payload = req.body
//     if (!payload) {
//       throw new Error('Payload is required.')
//     }
//     const validPayload = checkIpPayloadSchema.safeParse(payload)
//     if (!validPayload.success) {
//       throw new Error('payload has the incorrect shape. please check you types')
//     }

//     const merchantCode = 'pancake_swap_test'
//     const timestamp = Date.now().toString()

//     const payloadString = JSON.stringify(validPayload.data)
//     const contentToSign = `${payloadString}&merchantCode=${merchantCode}&timestamp=${timestamp}`
//     const signature = sign(contentToSign, process.env.SIGNER,)
//     const endpoint = 'https://sandbox.bifinitypay.com/bapi/fiat/v1/public/open-api/connect/check-ip-address'

//   post<any, any>(endpoint, payload, {
//         headers: {
//           'Content-Type': 'application/json',
//           merchantCode,
//           timestamp,
//           'x-api-signature': signature,
//         },
//       })
//       .then((response) => {
//         res.status(response.status).json(response.data)
//       })
//       .catch((error) => {
//         if (error.response) {
//           res.status(error.response.status).json(error.response.data)
//         } else {
//           res.status(500).json({ error: 'Internal Server Error' })
//         }
//       })
//   } catch (error: any) {
//     res.status(400).json({ error: error.message || 'Bad Request' })
//   }
// }
