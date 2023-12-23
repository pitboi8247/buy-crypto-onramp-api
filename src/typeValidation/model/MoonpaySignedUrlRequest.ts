import { ParsedQs } from "qs";

export class GetMoonPaySignedUrlRequest {
      private readonly _walletAddress: string;
      private readonly _defaultCurrencyCode: string;
      private readonly _baseCurrencyCode: string;
      private readonly _baseCurrencyAmount: string;
      private readonly _redirectUrl: string;
      private readonly _theme: string;
      private readonly _isTestEnv: string;
      private readonly _type: string;

      constructor(
            type: string,
            defaultCurrencyCode: string,
            baseCurrencyCode: string,
            baseCurrencyAmount: string,
            redirectUrl: string,
            theme: string,
            walletAddress: string,
            isTestEnv: string
      ) {
            this._type = type;
            this._defaultCurrencyCode = defaultCurrencyCode;
            this._baseCurrencyCode = baseCurrencyCode;
            this._baseCurrencyAmount = baseCurrencyAmount;
            this._redirectUrl = redirectUrl;
            this._theme = theme;
            this._walletAddress = walletAddress;
            this._isTestEnv = isTestEnv;
      }

      get walletAddress(): string {
            return this._walletAddress;
      }
      get type(): string {
            return this._type;
      }
      get defaultCurrencyCode(): string {
            return this._defaultCurrencyCode;
      }
      get baseCurrencyCode(): string {
            return this._baseCurrencyCode;
      }
      get baseCurrencyAmount(): string {
            return this._baseCurrencyAmount;
      }
      get redirectUrl(): string {
            return this._redirectUrl;
      }
      get theme(): string {
            return this._theme;
      }
      get isTestEnv(): string {
            return this._isTestEnv;
      }
}

export function toDto(query: ParsedQs): GetMoonPaySignedUrlRequest {
      const type = query.type as string;
      const defaultCurrencyCode = query.defaultCurrencyCode as string;
      const baseCurrencyCode = query.baseCurrencyCode as string;
      const baseCurrencyAmount = query.baseCurrencyAmount as string;
      const redirectUrl = query.redirectUrl as string;
      const theme = query.theme as string;
      const isTestEnv = query.isTestEnv as string;
      const walletAddress = query.walletAddress as string;

      return new GetMoonPaySignedUrlRequest(
            type,
            defaultCurrencyCode,
            baseCurrencyCode,
            baseCurrencyAmount,
            redirectUrl,
            theme,
            walletAddress,
            isTestEnv
      );
}
