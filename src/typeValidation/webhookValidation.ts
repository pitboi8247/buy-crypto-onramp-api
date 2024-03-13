import { z } from "zod";
import type {
      MercuryoWebhookResponse,
      MoonPayWebhookResponse,
      TransakWebhookEventVerified,
} from "../api/webhooks/types";

export const MercuryoDataPayloadSchema = z.object({
      amount: z.string(),
      currency: z.string(),
      status: z.string(),
});

export const MercuryoWebhookSchema = z.object({
      data: MercuryoDataPayloadSchema,
      eventId: z.string(),
});

export const MoonPayWebhookResponseSchema = z.object({
      data: z.object({
            status: z.string(),
            walletAddress: z.string(),
            quoteCurrencyAmount: z.number().nullable(),
            currency: z.object({
                  code: z.string(),
            }),
            getValidQuote: z.object({
                  transactionId: z.string(),
            }),
      }),
      type: z.string(),
      externalCustomerId: z.string().nullable(),
});

export const TransakWebhookEventVerifiedSchema = z.object({
      webhookData: z.object({
            id: z.string(),
            walletAddress: z.string(),
            createdAt: z.string(),
            status: z.string(),
            fiatCurrency: z.string(),
            cryptoCurrency: z.string(),
            cryptoAmount: z.number(),
            partnerOrderId: z.string(),
      }),
      eventID: z.string(),
      createdAt: z.string(),
});

export const ValidateMercuryoWebHookPayload = (
      request: MercuryoWebhookResponse
):
      | {
              success: true;
              data: MercuryoWebhookResponse["data"];
        }
      | {
              success: false;
              data: string;
        } => {
      const result = MercuryoWebhookSchema.safeParse(request);
      const { success } = result;

      if (success === true) {
            const data = result.data.data as MercuryoWebhookResponse["data"];
            return { success, data };
      }
      return {
            success,
            data: JSON.stringify(
                  `Provider quotes signature schema Validation Error ${JSON.stringify(result)}`
            ).replace(/\\/g, ""),
      };
};

export const ValidateMoonPayoWebHookPayload = (
      request: MoonPayWebhookResponse
):
      | {
              success: true;
              data: MoonPayWebhookResponse;
        }
      | {
              success: false;
              data: string;
        } => {
      const result = MoonPayWebhookResponseSchema.safeParse(request);
      const { success } = result;

      if (success === true) {
            const data = result.data as MoonPayWebhookResponse;
            return { success, data };
      }
      return {
            success,
            data: JSON.stringify(
                  `Provider quotes signature schema Validation Error ${JSON.stringify(result)}`
            ).replace(/\\/g, ""),
      };
};

export const ValidateTransakWebHookPayload = (
      request: TransakWebhookEventVerified
):
      | {
              success: true;
              data: TransakWebhookEventVerified;
        }
      | {
              success: false;
              data: string;
        } => {
      const result = TransakWebhookEventVerifiedSchema.safeParse(request);
      const { success } = result;

      if (success === true) {
            const data = result.data as TransakWebhookEventVerified;
            return { success, data };
      }
      return {
            success,
            data: JSON.stringify(
                  `Provider quotes signature schema Validation Error ${JSON.stringify(result)}`
            ).replace(/\\/g, ""),
      };
};
