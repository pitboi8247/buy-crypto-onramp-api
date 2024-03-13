import { Request, Response } from "express";
import { Cache } from "../../cache";
import { checkCacheForDuplicateRequests } from "../../utils/checkCache";
import {
      ValidateMercuryoWebHookPayload,
      ValidateMoonPayoWebHookPayload,
      ValidateTransakWebHookPayload,
} from "../../typeValidation/webhookValidation";
import { generateHMAC } from "../../utils/rsa_sig";
import config from "../../config/config";
import jwt from "jsonwebtoken";
import { sendPushNotification } from "../notifications/notificationHandler";
import { BuilderNames } from "../notifications/notification/types";
import type {
      MercuryoWebhookResponse,
      MoonPayWebhookResponse,
      TransakWebhookEventVerified,
} from "./types";
import { notificationBodies } from "../notifications/notification/payloadBuiler";

const MoonPayCache = new Cache<string>(180);
const MercuryoCache = new Cache<string>(180);
const TransakCache = new Cache<string>(180);

export const MoonPayTestWebhook = async (req: Request, res: Response): Promise<void> => {
      const MoonPayEvent = req.body as MoonPayWebhookResponse;
      const moonpayValidationResult = ValidateMoonPayoWebHookPayload(MoonPayEvent);

      if (moonpayValidationResult.success === false) {
            throw new Error(moonpayValidationResult.data);
      }

      const isDuplicateRequest = checkCacheForDuplicateRequests(
            MoonPayEvent.data.status,
            MoonPayEvent.data.getValidQuote.transactionId,
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
            // biome-ignore lint/complexity/noForEach: <explanation>
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

            const expectedSignature = generateHMAC(config.moonpayTestWebhookKey, signedPayload);

            if (signature === expectedSignature) {
                  const baseCurrencyId = MoonPayEvent.data.currency.code.toUpperCase();
                  const quoteCurrencyAmount = MoonPayEvent.data.getValidQuote.quoteCurrencyAmount;
                  const { status, walletAddress } = MoonPayEvent.data;

                  if (status === "pending") {
                        const body = notificationBodies.TransactionProcessingNotification(
                              quoteCurrencyAmount,
                              baseCurrencyId
                        );
                        sendPushNotification(
                              BuilderNames.TransactionProcessingNotification,
                              [[walletAddress], "MoonPay", body],
                              [walletAddress]
                        );
                  }
                  if (status === "completed") {
                        const body = notificationBodies.TransactionCompleteNotification(
                              quoteCurrencyAmount,
                              baseCurrencyId
                        );
                        sendPushNotification(
                              BuilderNames.TransactionCompleteNotification,
                              [[walletAddress], "MoonPay", body],
                              [walletAddress]
                        );
                  }
                  if (status === "failed") {
                        const body = notificationBodies.TransactionFailedNotification(
                              quoteCurrencyAmount,
                              baseCurrencyId
                        );
                        sendPushNotification(
                              BuilderNames.TransactionFailedNotification,
                              [[walletAddress], "MoonPay", body],
                              [walletAddress]
                        );
                  }
                  res.send({ "webhook event verified": MoonPayEvent });
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
      const mercuryoResponse = req.body as MercuryoWebhookResponse;
      const mercuryoEvent = ValidateMercuryoWebHookPayload(mercuryoResponse);

      if (mercuryoEvent.success === false) {
            throw new Error(mercuryoEvent.data);
      }

      const isDuplicateRequest = checkCacheForDuplicateRequests(
            mercuryoEvent.data.status,
            mercuryoEvent.data.merchant_transaction_id,
            MercuryoCache
      );
      if (isDuplicateRequest) {
            res.status(200).send({ message: "Duplicate event. Already processed." });
            return;
      }
      const mercuryoSignature = req.headers["x-signature"] as string;
      if (mercuryoSignature) {
            const expectedSignature = generateHMAC(
                  config.mercuryoSignKey,
                  JSON.stringify(mercuryoResponse)
            );

            if (mercuryoSignature === expectedSignature) {
                  const { status, amount, currency } = mercuryoEvent.data;
                  const walletAddress = "";
                  if (status === "pending") {
                        const body = notificationBodies.TransactionProcessingNotification(
                              amount,
                              currency
                        );
                        sendPushNotification(
                              BuilderNames.TransactionProcessingNotification,
                              [[walletAddress], "Mercuryo", body],
                              [walletAddress]
                        );
                  }
                  if (status === "paid") {
                        const body = notificationBodies.TransactionCompleteNotification(
                              amount,
                              currency
                        );
                        sendPushNotification(
                              BuilderNames.TransactionCompleteNotification,
                              [[walletAddress], "Mercuryo", body],
                              [walletAddress]
                        );
                  }
                  if (status === "order_failed") {
                        const body = notificationBodies.TransactionFailedNotification(amount, currency);
                        sendPushNotification(
                              BuilderNames.TransactionFailedNotification,
                              [[walletAddress], "Mercuryo", body],
                              [walletAddress]
                        );
                  }
                  res.send({ "webhook event verified": mercuryoEvent });
            } else {
                  res.status(400).send("Signatures do not match!");
            }
      } else {
            res.status(400).send("Mercuryo header is missing.");
      }
};

export const TransakWebhook = async (req: Request, res: Response): Promise<void> => {
      const accessToken =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBUElfS0VZIjoiZjJiODVjZjItMmVhNS00Y2E3LWFhZWQtOTZjODczMDY2NDU4IiwiaWF0IjoxNzA5NDM0Njk1LCJleHAiOjE3MTAwMzk0OTV9.OWIALaGKqIcvr_DSKGY0IHXQHlpc5x6z0D8kIoqBGwU";
      const transakEvent = jwt.verify(req.body.data, accessToken) as TransakWebhookEventVerified;
      const transakValidationResult = ValidateTransakWebHookPayload(transakEvent);

      if (transakValidationResult.success === false) {
            throw new Error(transakValidationResult.data);
      }

      const status = transakEvent.eventID;
      const { partnerOrderId, walletAddress, cryptoAmount, cryptoCurrency } = transakEvent.webhookData;

      const isDuplicateRequest = checkCacheForDuplicateRequests(status, partnerOrderId, TransakCache);
      if (isDuplicateRequest) {
            res.status(200).send({ message: "Duplicate event. Already processed." });
            return;
      }
      if (status === "ORDER_PROCESSING") {
            const body = notificationBodies.TransactionProcessingNotification(
                  cryptoAmount,
                  cryptoCurrency
            );
            sendPushNotification(
                  BuilderNames.TransactionProcessingNotification,
                  [[walletAddress], "Transak", body],
                  [walletAddress]
            );
      }
      if (status === "ORDER_COMPLETED") {
            const body = notificationBodies.TransactionCompleteNotification(
                  cryptoAmount,
                  cryptoCurrency
            );
            sendPushNotification(
                  BuilderNames.TransactionCompleteNotification,
                  [[walletAddress], "Transak", body],
                  [walletAddress]
            );
      }
      if (status === "ORDER_FAILED") {
            const body = notificationBodies.TransactionFailedNotification(cryptoAmount, cryptoCurrency);
            sendPushNotification(
                  BuilderNames.TransactionFailedNotification,
                  [[walletAddress], "Transak", body],
                  [walletAddress]
            );
      }
      res.send({ "webhook event verified": transakEvent });
};
