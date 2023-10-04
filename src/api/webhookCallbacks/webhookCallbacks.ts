import { Request, Response } from 'express';
import { Cache } from '../../cache';
import config from '../../config/config';
import { WebhookResponse } from '../../typeValidation/types';
import { checkCacheForDuplicateRequests } from '../../utils/checkCache';
import { generateHMAC } from '../../utils/rsa_sig';
import sendBuyCryptoNotification from '../../utils/sendBuyCryptoNotification';

const MoonPayCache = new Cache<string>(60);
const MercuryoCache = new Cache<string>(60);

export const MoonPayTestWebhook = async (req: Request, res: Response): Promise<void> => {
	const MoonPayEvent = req.body.data;
	
	// const isDuplicateRequest = checkCacheForDuplicateRequests(
	// 	data.status,
	// 	quote.transactionId,
	// 	MoonPayCache,
	// );
	// if (isDuplicateRequest) {
	// 	res.status(200).send({ message: "Duplicate event. Already processed." });
	// 	return;
	// }
	// const moonpaySignatureV2Header = req.headers["moonpay-signature-v2"] as string;
	// if (moonpaySignatureV2Header) {
	// 	const elements = moonpaySignatureV2Header.split(",");

	// 	const signatureData = {};
	// 	elements.forEach((element) => {
	// 		const [prefix, value] = element.split("=");
	// 		signatureData[prefix.trim()] = value.trim();
	// 	});

	// 	const timestamp = signatureData["t"];
	// 	const signature = signatureData["s"];

	// 	let signedPayload = timestamp + ".";
	// 	if (req.method === "POST") {
	// 		const payload = JSON.stringify(req.body);
	// 		signedPayload += payload;
	// 	} else if (req.method === "GET") {
	// 		const searchString = req.url.split("?")[1];
	// 		signedPayload += searchString;
	// 	}

	// 	const expectedSignature = generateHMAC(config.moonpayWebhookKey, signedPayload);
	// 	if (signature === expectedSignature) {
	// 		const extractedData: WebhookResponse = {
	// 			walletAddress: data.walletAddress,
	// 			fiatAmount: Number(quote.baseCurrencyAmount),
	// 			cryptoAmount: Number(quote.quoteCurrencyAmount),
	// 			fiatCurrency: baseCurrency.code.toUpperCase(),
	// 			cryptoCurrency: currency.code.toUpperCase(),
	// 			status: data.status,
	// 			transactionId: quote.transactionId,
	// 			updatedAt: quote.updatedAt,
	// 			network: currency.metadata.networkCode,
	// 			providerFee: quote.feeAmount,
	// 			networkFee: quote.networkFeeAmount,
	// 			rate: quote.quoteCurrencyPrice,
	// 			type: "MoonPay",
	// 		};
	// 		websocketserver.emitMostRecentMessges(extractedData);
			res.status(200).send({ "Signatures match!": { MoonPayEvent } });
	// 	} else {
	// 		res.status(400).send({
	// 			"Signatures do not match!": { signature, expectedSignature },
	// 		});
	// 	}
	// } else {
	// 	res.status(400).send("Moonpay-Signature-V2 header is missing.");
	// }
};

export const MercuryoTestWebhook = async (req: Request, res: Response): Promise<void> => {
  const mercuryoEvent = req.body.data;
  const { status, merchant_transaction_id } = mercuryoEvent;
  const mercuryoSignature = req.headers['x-signature'] as string;

  const isDuplicateRequest = checkCacheForDuplicateRequests(status, merchant_transaction_id, MercuryoCache);
  if (isDuplicateRequest) {
  	res.status(200).send({ message: "Duplicate event. Already processed." });
  	return;
  }
  
  if (mercuryoSignature) {
    const expectedSignature = generateHMAC(config.mercuryoSignKey, JSON.stringify(req.body));
    if (mercuryoSignature === expectedSignature) {
      let overideStatus = status;
      if (status === 'paid') overideStatus = 'complete';
      if (status === 'completed') overideStatus = 'complete';
      if (status === 'order_failed') overideStatus = 'failed';

      const extractedData: WebhookResponse = {
        walletAddress:'mercuryoEvent.merchant_transaction_id.split()[0]',
        fiatAmount: Number(mercuryoEvent.fiat_amount),
        cryptoAmount: Number(mercuryoEvent.amount),
        fiatCurrency: mercuryoEvent.fiat_currency.toUpperCase(),
        cryptoCurrency: mercuryoEvent.currency.toUpperCase(),
        status: overideStatus,
        transactionId: mercuryoEvent.merchant_transaction_id,
        providerFee: mercuryoEvent.fee,
      };
    
      if (overideStatus === 'complete' || overideStatus === 'failed') {
        await sendBuyCryptoNotification(extractedData, 'Mercuryo');
      }
      res.send({ 'webhook event verified': req.body.data });
    } else {
      res.status(400).send('Signatures do not match!');
    }
  } else {
    res.status(400).send('Mercuryo header is missing.');
  }
};
