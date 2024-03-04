import { Request, Response } from "express";
import { Cache } from "../../cache";
import { checkCacheForDuplicateRequests } from "../../utils/checkCache";
import {
      baseCurrencySchema,
      currencySchema,
      dataSchema,
      getValidQuoteSchema,
      myDataSchema,
} from "../../typeValidation/webhookValidation";
import { generateHMAC } from "../../utils/rsa_sig";
import config from "../../config/config";
import jwt from "jsonwebtoken";
import { sendPushNotification } from "../notifications/notificationHandler";
import { BuilderNames } from "../notifications/notification/types";
import { TransakWebhookEventVerified, WebhookResponse } from "./types";

const MoonPayCache = new Cache<string>(60);
const MercuryoCache = new Cache<string>(60);
const TransakCache = new Cache<string>(60);

export const MoonPayTestWebhook = async (req: Request, res: Response): Promise<void> => {
      const MoonPayEvent = req.body.data;
      const baseCurrency = baseCurrencySchema.parse(MoonPayEvent.baseCurrency);
      const currency = currencySchema.parse(MoonPayEvent.currency);
      const quote = getValidQuoteSchema.parse(MoonPayEvent.getValidQuote);
      const data = dataSchema.parse(MoonPayEvent);

      const isDuplicateRequest = checkCacheForDuplicateRequests(
            data.status,
            quote.transactionId,
            MoonPayCache
      );
      if (isDuplicateRequest) {
            res.status(200).send({ message: "Duplicate event. Already processed." });
            return;
      }
      const moonpaySignatureV2Header = req.headers["moonpay-signature-v2"] as string;
      if (moonpaySignatureV2Header) {
            const elements = moonpaySignatureV2Header.split(",");

            const signatureData = {};
            elements.forEach((element) => {
                  const [prefix, value] = element.split("=");
                  signatureData[prefix.trim()] = value.trim();
            });

            const timestamp = signatureData["t"];
            const signature = signatureData["s"];

            let signedPayload = timestamp + ".";
            if (req.method === "POST") {
                  const payload = JSON.stringify(req.body);
                  signedPayload += payload;
            } else if (req.method === "GET") {
                  const searchString = req.url.split("?")[1];
                  signedPayload += searchString;
            }

            const expectedSignature = generateHMAC(config.mercuryoSecretKey, signedPayload);
            if (signature === expectedSignature) {
                  const extractedData: WebhookResponse = {
                        walletAddress: data.walletAddress,
                        fiatAmount: Number(quote.baseCurrencyAmount),
                        cryptoAmount: Number(quote.quoteCurrencyAmount),
                        fiatCurrency: baseCurrency.code.toUpperCase(),
                        cryptoCurrency: currency.code.toUpperCase(),
                        status: data.status,
                        transactionId: quote.transactionId,
                        updatedAt: quote.updatedAt,
                        network: currency.metadata.networkCode,
                        providerFee: quote.feeAmount,
                        networkFee: quote.networkFeeAmount,
                        rate: quote.quoteCurrencyPrice,
                        type: "MoonPay",
                  };
                  // websocketserver.emitMostRecentMessges(extractedData);
                  res.status(200).send({ "Signatures match!": { extractedData } });
            } else {
                  res.status(400).send({
                        "Signatures do not match!": { signature, expectedSignature },
                  });
            }
      } else {
            res.status(400).send("Moonpay-Signature-V2 header is missing.");
      }
};

export const MercuryoTestWebhook = async (req: Request, res: Response): Promise<void> => {
      const mercuryoEvent = myDataSchema.parse(req.body).data;
      const { status, merchant_transaction_id } = mercuryoEvent;

      const isDuplicateRequest = checkCacheForDuplicateRequests(
            status,
            merchant_transaction_id,
            MercuryoCache
      );
      if (isDuplicateRequest) {
            res.status(200).send({ message: "Duplicate event. Already processed." });
            return;
      }
      const mercuryoSignature = req.headers["x-signature"] as string;
      if (mercuryoSignature) {
            const expectedSignature = generateHMAC(config.mercuryoSignKey, JSON.stringify(req.body));
            if (mercuryoSignature === expectedSignature) {
                  let overideStatus = status;
                  if (status === "new") overideStatus = "pending";
                  if (status === "order_failed") overideStatus = "failed";

                  const extractedData: WebhookResponse = {
                        walletAddress: mercuryoEvent.user.uuid4,
                        fiatAmount: Number(mercuryoEvent.fiat_amount),
                        cryptoAmount: Number(mercuryoEvent.amount),
                        fiatCurrency: mercuryoEvent.fiat_currency.toUpperCase(),
                        cryptoCurrency: mercuryoEvent.currency.toUpperCase(),
                        status: overideStatus,
                        transactionId: mercuryoEvent.merchant_transaction_id,
                        updatedAt: mercuryoEvent.updated_at,
                        network: "",
                        providerFee: 0,
                        networkFee: 0,
                        rate: 0,
                        type: "Mercuryo",
                  };
                  // websocketserver.emitMostRecentMessges(extractedData);
                  res.send({ "webhook event verified": extractedData });
            } else {
                  res.status(400).send("Signatures do not match!");
            }
      } else {
            res.status(400).send("Mercuryo header is missing.");
      }
};

export const TransakWebhook = async (req: Request, res: Response): Promise<void> => {
      const transakEvent = req.body;
      const accessToken =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBUElfS0VZIjoiZjJiODVjZjItMmVhNS00Y2E3LWFhZWQtOTZjODczMDY2NDU4IiwiaWF0IjoxNzA5NDM0Njk1LCJleHAiOjE3MTAwMzk0OTV9.OWIALaGKqIcvr_DSKGY0IHXQHlpc5x6z0D8kIoqBGwU";
      const decodedData = jwt.verify(transakEvent.data, accessToken);

      console.log(decodedData);
      const webhookData = decodedData as TransakWebhookEventVerified;
      const status = webhookData.eventID;
      const { partnerOrderId, walletAddress, cryptoAmount, cryptoCurrency } = webhookData.webhookData;

      const isDuplicateRequest = checkCacheForDuplicateRequests(status, partnerOrderId, TransakCache);
      if (isDuplicateRequest) {
            res.status(200).send({ message: "Duplicate event. Already processed." });
            return;
      }
      if (status === "ORDER_PROCESSING") {
            const body = `Your transaction for ${cryptoAmount} ${cryptoCurrency} is processing. you will be notified once the funds arrive to your wallet.`;
            sendPushNotification(
                  BuilderNames.TransactionProcessingNotification,
                  [[walletAddress], "Transak", body],
                  [walletAddress as any]
            );
      }
      if (status === "ORDER_COMPLETED") {
            const body = `Your transaction for ${cryptoAmount} ${cryptoCurrency} is completed. the funds should now be in your wallet.`;
            sendPushNotification(
                  BuilderNames.TransactionCompleteNotification,
                  [[walletAddress], "Transak", body],
                  [walletAddress as any]
            );
      }
      if (status === "ORDER_FAILED") {
            const body = `Your transaction for ${cryptoAmount} ${cryptoCurrency} Failed. Sorry about this please reaxh out to support to follow up on the issue.`;
            sendPushNotification(
                  BuilderNames.TransactionFailedNotification,
                  [[walletAddress], "Transak", body],
                  [walletAddress as any]
            );
      }
      res.send({ "webhook event verified": decodedData });
};
