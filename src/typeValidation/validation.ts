import { number as zNumber, object as zObject, string as zString } from "zod";
import { GetMercuryoSignatureRequest } from "./model/MercuryoSignatureRequest";
import { GetMoonPaySignedUrlRequest } from "./model/MoonpaySignedUrlRequest";
import { GetProviderQuotesRequest } from "./model/ProviderQuotesRequest";
import { GetTransakPayUrlRequest } from "./model/TransakUrlRequest";

export const zQueryMoonPay = zObject({
      type: zString(),
      baseCurrencyAmount: zString(),
      baseCurrencyCode: zString(),
      defaultCurrencyCode: zString(),
      redirectUrl: zString(),
      theme: zString(),
      walletAddress: zString(),
      isTestEnv: zString(),
});

export const zQueryMercuryo = zObject({
      walletAddress: zString(),
});

export const zQueryTransak = zObject({
      fiatCurrency: zString(),
      cryptoCurrency: zString(),
      amount: zString(),
      network: zString(),
      walletAddress: zString(),
});

export const zQueryProviderQuotes = zObject({
      fiatCurrency: zString(),
      cryptoCurrency: zString(),
      fiatAmount: zNumber(),
      network: zNumber(),
});

export const checkIpPayloadSchema = zObject({
      userIp: zString(),
});

export const ValidateGetMoonPaySignedUrlRequest = (
      request: GetMoonPaySignedUrlRequest
): {
      success: boolean;
      data: GetMoonPaySignedUrlRequest | string;
} => {
      const result = zQueryMoonPay.safeParse(request);
      const { success } = result;

      if (success) {
            const data = result.data as GetMoonPaySignedUrlRequest;
            return { success, data };
      } else
            return {
                  success,
                  data: JSON.stringify(
                        `Moonpay Url signature schema Validation Error ${JSON.stringify(result)}`
                  ).replace(/\\/g, ""),
            };
};

export const ValidateGetMercuryoSignatureRequest = (
      request: GetMercuryoSignatureRequest
): {
      success: boolean;
      data: GetMercuryoSignatureRequest | string;
} => {
      const result = zQueryMercuryo.safeParse(request);
      const { success } = result;

      if (success) {
            const data = result.data as GetMercuryoSignatureRequest;
            return { success, data };
      } else
            return {
                  success,
                  data: JSON.stringify(
                        `Mercuryo signature schema Validation Error ${JSON.stringify(result)}`
                  ).replace(/\\/g, ""),
            };
};

export const ValidateGetTransakUrlRequest = (
      request: GetTransakPayUrlRequest
): {
      success: boolean;
      data: GetTransakPayUrlRequest | string;
} => {
      const result = zQueryTransak.safeParse(request);
      const { success } = result;

      if (success) {
            const data = result.data as GetTransakPayUrlRequest;
            return { success, data };
      } else
            return {
                  success,
                  data: JSON.stringify(
                        `Transak Url signature schema Validation Error ${JSON.stringify(result)}`
                  ).replace(/\\/g, ""),
            };
};

export const ValidateeProviderQuotesRequest = (
      request: GetProviderQuotesRequest
): {
      success: boolean;
      data: GetProviderQuotesRequest | string;
} => {
      const result = zQueryProviderQuotes.safeParse(request);
      const { success } = result;

      if (success) {
            const data = result.data as GetProviderQuotesRequest;
            return { success, data };
      } else
            return {
                  success,
                  data: JSON.stringify(
                        `Provider quotes signature schema Validation Error ${JSON.stringify(result)}`
                  ).replace(/\\/g, ""),
            };
};
