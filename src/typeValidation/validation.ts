import { Response } from "express";
import qs from "qs";
import {
      object as zObject,
      string as zString,
      number as zNumber,
      enum as zEnum,
      boolean as zBoolean,
} from "zod";
import { GetMoonPaySignedUrlRequest } from "./model/MoonpaySignedUrlRequest";
import { GetTransakPayUrlRequest } from "./model/TransakUrlRequest";
import { GetProviderQuotesRequest } from "./model/ProviderQuotesRequest";
import { GetUserIpRequest } from "./model/UserIpRequest";
import { ParsedMercuryGet, ParsedMercuryPOST } from "./types";
import { GetProviderLimitRequest } from "./model/ProviderLimitRequest";
import { GetProviderSigRequest } from "./model/ProxiedSigRequest";
import { GetBtcAddressValidationRequest } from "./model/BitcoinAddressValidationRequest";

export const zQueryMoonPay = zObject({
      type: zString(),
      baseCurrencyAmount: zString(),
      baseCurrencyCode: zString(),
      defaultCurrencyCode: zString(),
      redirectUrl: zString(),
      theme: zString(),
      walletAddress: zString(),
      externalTransactionId: zString(),
      isTestEnv: zString(),
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
      isFiat: zBoolean(),
});

export const zQueryProviderLimit = zObject({
      fiatCurrency: zString(),
      cryptoCurrency: zString(),
      network: zNumber(),
});

export const mercuryoGET = zObject({
      walletAddress: zString(),
});

export const mercuryoPOST = zObject({
      message: zString(),
});

export const mercuryoSigningAPISchema = zObject({
      mercuryoGET,
      mercuryoPOST,
});

export const checkIpPayloadSchema = zObject({
      userIp: zString(),
});

export const checkBtcAddressPayloadSchema = zObject({
      address: zString(),
      network: zEnum(["mainnet", "testnet", "regtest"]),
});
export const zQueryProviderSig = zObject({
      provider: zEnum(["MoonPay", "Mercuryo", "Transak"]),
      fiatCurrency: zString(),
      cryptoCurrency: zString(),
      amount: zString(),
      network: zString(),
      walletAddress: zString(),
});

export const validateMercuryoSchema = (
      indexer: string,
      queryParsed: qs.ParsedQs,
      res: Response
): ParsedMercuryGet | ParsedMercuryPOST | Response => {
      const parsed = mercuryoSigningAPISchema.shape[indexer].safeParse(queryParsed);
      if (parsed.success === false)
            return res.status(400).json({ success: false, message: JSON.stringify(queryParsed) });
      else return parsed;
};

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

export const ValidateProviderSigRequest = (
      request: GetProviderSigRequest
): {
      success: boolean;
      data: GetProviderSigRequest | string;
} => {
      const result = zQueryProviderSig.safeParse(request);
      const { success } = result;

      if (success) {
            const data = result.data as GetProviderSigRequest;
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

export const ValidateeProviderLimitRequest = (
      request: GetProviderLimitRequest
): {
      success: boolean;
      data: GetProviderLimitRequest | string;
} => {
      const result = zQueryProviderLimit.safeParse(request);
      const { success } = result;

      if (success) {
            const data = result.data as GetProviderLimitRequest;
            return { success, data };
      } else
            return {
                  success,
                  data: JSON.stringify(
                        `Provider quotes signature schema Validation Error ${JSON.stringify(result)}`
                  ).replace(/\\/g, ""),
            };
};

export const ValidateUserIpRequest = (
      request: GetUserIpRequest
): {
      success: boolean;
      data: GetUserIpRequest | string;
} => {
      const result = checkIpPayloadSchema.safeParse(request);
      const { success } = result;

      if (success) {
            const data = result.data as GetUserIpRequest;
            return { success, data };
      } else
            return {
                  success,
                  data: JSON.stringify(
                        `Provider quotes signature schema Validation Error ${JSON.stringify(result)}`
                  ).replace(/\\/g, ""),
            };
};

export const ValidateBitcoinAddressRes = (
      request: GetBtcAddressValidationRequest
): {
      success: boolean;
      data: GetBtcAddressValidationRequest | string;
} => {
      const result = checkBtcAddressPayloadSchema.safeParse(request);
      const { success } = result;

      if (success) {
            const data = result.data as GetBtcAddressValidationRequest;
            return { success, data };
      } else
            return {
                  success,
                  data: JSON.stringify(
                        `Provider quotes signature schema Validation Error ${JSON.stringify(result)}`
                  ).replace(/\\/g, ""),
            };
};
