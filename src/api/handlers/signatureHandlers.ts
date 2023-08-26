import { NextFunction, Request, Response } from 'express';

import crypto from 'crypto';
import config from '../../config/config';
import { MOONPAY_TEST_URL, MOONPAY_URL } from '../../config/constants';
import { APIError } from '../../utils/APIError';
import { ParsedMercuryGet, ParsedMercuryPOST, validateMercuryoSchema } from '../../typeValidation/validation';
import qs from 'qs';

export const generateMercuryoSig = async (req: Request, res: Response, next: NextFunction) => {
  const queryString =
    req.method === 'GET'
      ? qs.stringify({ walletAddress: req.query.walletAddress })
      : qs.stringify({ message: req.body.message });

  const queryParsed = qs.parse(queryString);

  const secret = await crypto.webcrypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(config.mercuryoSecretKey),
    { name: 'HMAC', hash: 'SHA-512' },
    false,
    ['sign', 'verify'],
  );

  if (req.method === 'GET') {
    const parsed = validateMercuryoSchema('mercuryoGET', queryParsed, res) as ParsedMercuryGet;
    const { walletAddress } = parsed.data;
    const hash = crypto.createHash('sha512').update(`${walletAddress}${config.mercuryoSecretKey}`).digest('hex')
    return res.json({ signature: hash });

  } else if (req.method === 'POST') {
    const parsed = validateMercuryoSchema('mercuryoPOST', queryParsed, res) as ParsedMercuryPOST;

    const { message } = parsed.data;
    const signature = req.headers['x-api-signature'] as string | undefined;
    if (!signature) {
      return res
        .status(400)
        .json({ success: false, reason: 'the signature need to be included in the headers as x-api-signature' });
    }
    const sigBuf = Uint8Array.from(atob(signature), (c) => c.charCodeAt(0));
    const isVerified = await crypto.webcrypto.subtle.verify('HMAC', secret, sigBuf, new TextEncoder().encode(message));

    return res.json({ verified: isVerified });
  } else {
    return res.status(400).json({ success: false, message: 'unsupported method' });
  }
};


export const generateMoonPaySig = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const moonPayParams = { ...req.body };
    const supportedTokens = moonPayParams.showOnlyCurrencies;
    const encodedCurrencyList = encodeURIComponent(supportedTokens);
    console.log(encodedCurrencyList);
    const moonPayTradeUrl = `&theme=${moonPayParams.theme}&colorCode=%2382DBE3&lockAmount=true&currencyCode=${moonPayParams.defaultCurrencyCode}&baseCurrencyCode=${moonPayParams.baseCurrencyCode}&baseCurrencyAmount=${moonPayParams.baseCurrencyAmount}&walletAddress=${moonPayParams.walletAddress}`;

    const originalUrl = `${moonPayParams.isTestEnv ? MOONPAY_TEST_URL : MOONPAY_URL}${moonPayTradeUrl}`;

    const signature = crypto
      .createHmac(
        'sha256',
        moonPayParams.isTestEnv ? 'sk_test_7zfPNfcZdStyiktn3lOJxOltGttayhC' : 'sk_live_FwlMuWmSACR3MNFA9mwrY8yVswPBpK',
      )
      .update(new URL(originalUrl).search)
      .digest('base64');

    const returnData = `${originalUrl}&signature=${encodeURIComponent(signature)}`;

    res.json({ urlWithSignature: returnData });
  } catch (error) {
    return next(new APIError(error.message, error?.reason, error?.status));
  }
};
