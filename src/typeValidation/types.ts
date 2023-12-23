export type Providers = "MoonPay" | "Mercuryo" | "Transak";

export type ProviderQuotes = {
      code: Providers;
      result: any;
      error: boolean;
};

export type WebhookResponse = {
      walletAddress: string;
      fiatAmount: number;
      cryptoAmount: number;
      fiatCurrency: string;
      cryptoCurrency: string;
      status: string;
      transactionId: string;
      providerFee: number;
};

type Options =
      | {
              method?: string;
              walletAddress: string;
              cryptoCurrency: string;
              fiatCurrency: string;
              amount: string;
        }
      | {
              method?: string;
              message?: string;
        };

export type SafeParseReturnType<U extends Options> = {
      data: U;
};

export type ParsedMercuryGet = SafeParseReturnType<{
      method?: string;
      walletAddress?: string;
}>;

export type ParsedMercuryPOST = SafeParseReturnType<{
      method?: string;
      message?: string;
}>;
