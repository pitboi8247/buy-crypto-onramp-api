export type WebhookResponse = {
      walletAddress: string;
      fiatAmount: number;
      cryptoAmount: number;
      fiatCurrency: string;
      cryptoCurrency: string;
      status: string;
      transactionId: string;
      updatedAt: string;
      network: string;
      providerFee: number;
      networkFee: number;
      rate: number;
      type: string;
};

export interface TransakWebhookEventVerified {
      webhookData: {
            id: string;
            walletAddress: string;
            createdAt: string;
            status: string;
            fiatCurrency: string;
            userId: string;
            cryptoCurrency: string;
            isBuyOrSell: string;
            fiatAmount: number;
            ipAddress: string;
            amountPaid: number;
            paymentOptionId: string;
            walletLink: string;
            orderProcessingType: string;
            addressAdditionalData: boolean;
            network: string;
            conversionPrice: number;
            cryptoAmount: number;
            totalFeeInFiat: number;
            fiatAmountInUsd: number;
            countryCode: string;
            partnerOrderId: string;
            stateCode: string;
            userKycType: string;
            cardPaymentData: {
                  orderId: string;
                  paymentId: string;
                  pgData: {
                        redirectionRequired: boolean;
                        redirectionRequestData: {
                              method: string;
                              header: any;
                              redirectUrl: string;
                              body: any;
                        };
                  };
                  liquidityProvider: string;
                  updatedAt: string;
            };
            partnerFeeInLocalCurrency: number;
            conversionPriceData: {
                  _id: string;
                  id: string;
                  createdAt: string;
                  fiatCurrency: string;
                  cryptoCurrency: string;
                  paymentMethod: string;
                  fiatAmount: number;
                  network: string;
                  cryptoAmount: number;
                  isBuyOrSell: string;
                  conversionPrice: number;
                  marketConversionPrice: number;
                  slippage: number;
                  cryptoLiquidityProvider: string;
                  fiatLiquidityProvider: string;
                  partnerApiKey: string;
                  sourceTokenAmount: number;
                  sourceToken: string;
                  notes: string[];
                  fiatFeeAmount: number;
                  feeDecimal: number;
                  swaps: {
                        sourceCurrency: string;
                        destinationCurrency: string;
                        sourceAmount: number;
                        destinationAmount: number;
                        paymentMethod: string;
                        liquidityProvider: string;
                        conversionPrice: number;
                        feeInSourceAmount: number;
                        networkFeeInSourceAmount: number;
                        marketConversionPrice: number;
                        isNonCustodial: boolean;
                        isFiatliquidityProvider: boolean;
                        isFiatPartnerDirectCryptoDeposit: boolean;
                        isFiatPartnerAccountWalletDeposit: boolean;
                        liquidityProviderData: boolean;
                        originalDestinationAmount: number;
                  }[];
                  fees: {
                        name: string;
                        value: number;
                        id: string;
                        ids: string[];
                  }[];
                  fiatAmountInUsd: number;
                  internalFees: {
                        name: string;
                        id: string;
                        value: number;
                  }[];
                  cost: {
                        ethPriceInLocalCurrency: number;
                        gasCostinLocalCurrency: number;
                        transakMinimumFee: number;
                        transakFeeAmount: number;
                        fiatLiquidityProviderFee: number;
                        gasCostinLocalCurrencyByFiatPartner: number;
                        gasCostinLocalCurrencyByCryptoPartner: number;
                        partnerFeeDecimal: number;
                        partnerFeeInLocalCurrency: number;
                        totalFeeDecimal: number;
                        totalFeeAmount: number;
                        gasCurrency: string;
                        gasInNativeToken: number;
                        gasCurrencyRateInUsd: number;
                        totalAmountChargedByTransak: number;
                  };
            };
      };
      eventID: string;
      createdAt: string;
}

interface BaseCurrency {
      decimals: number | null;
      maxAmount: number;
      minAmount: number;
      minBuyAmount: number;
      maxBuyAmount: number | null;
      id: string;
      createdAt: string;
      updatedAt: string;
      type: string;
      name: string;
      code: string;
      precision: number;
      isSellSupported: boolean;
}

interface Currency {
      decimals: number;
      maxAmount: number;
      minAmount: number;
      minBuyAmount: number;
      maxBuyAmount: number | null;
      notAllowedUSStates: string[];
      notAllowedCountries: string[];
      id: string;
      createdAt: string;
      updatedAt: string;
      type: string;
      name: string;
      code: string;
      precision: number;
      isSellSupported: boolean;
      addressRegex: string | null;
      testnetAddressRegex: string | null;
      supportsAddressTag: boolean;
      addressTagRegex: string | null;
      supportsTestMode: boolean;
      supportsLiveMode: boolean;
      isSuspended: boolean;
      isSupportedInUS: boolean;
      confirmationsRequired: number;
      minSellAmount: number;
      maxSellAmount: number;
      metadata: {
            contractAddress: string;
            coinType: string;
            chainId: string;
            networkCode: string;
      };
}

interface Stage {
      stage: string;
      status: string;
      actions: any[];
      failureReason: any | null;
      metaData: any[];
}

interface Data {
      isFromQuote: boolean;
      getValidQuote: {
            isValid: boolean;
            externalId: any | null;
            quoteCurrencySpreadPercentage: number;
            id: string;
            createdAt: string;
            updatedAt: string;
            transactionId: string;
            baseCurrencyId: string;
            baseCurrencyAmount: number;
            quoteCurrencyId: string;
            quoteCurrencyAmount: number;
            quoteCurrencyPrice: number;
            feeAmount: number;
            extraFeeAmount: number;
            networkFeeAmount: number;
            networkFeeAmountNonRefundable: boolean;
            areFeesIncluded: boolean;
            signature: string;
            provider: string;
      };
      isRecurring: boolean;
      walletAddressTag: any | null;
      failureReason: any | null;
      returnUrl: string;
      widgetRedirectUrl: any | null;
      bankDepositInformation: any | null;
      feeAmountDiscount: any | null;
      extraFeeAmountDiscount: any | null;
      paymentMethod: string;
      id: string;
      createdAt: string;
      updatedAt: string;
      baseCurrencyAmount: number;
      quoteCurrencyAmount: number;
      feeAmount: number;
      extraFeeAmount: number;
      networkFeeAmount: number;
      areFeesIncluded: boolean;
      flow: string;
      status: string;
      walletAddress: string;
      cryptoTransactionId: string;
      redirectUrl: string;
      bankTransferReference: any | null;
      baseCurrencyId: string;
      currencyId: string;
      customerId: string;
      cardId: string;
      bankAccountId: string | null;
      eurRate: number;
      usdRate: number;
      gbpRate: number;
      externalTransactionId: string;
      baseCurrency: BaseCurrency;
      currency: Currency;
      nftTransaction: any | null;
      stages: Stage[];
      country: string;
      state: any | null;
      cardType: string;
      cardPaymentType: string;
      externalCustomerId: string | null;
      nftToken: string | null;
}

export interface MoonPayWebhookResponse {
      data: Data;
      type: string;
      externalCustomerId: string | null;
}

interface User {
      uuid4: string;
      country_code: string;
      phone: string;
}

export interface MercuryoWebhookResponse {
      data: {
            amount: string;
            fiat_amount: string;
            id: string;
            created_at: string;
            created_at_ts: number;
            updated_at: string;
            updated_at_ts: number;
            type: string;
            merchant_transaction_id: string;
            currency: string;
            fiat_currency: string;
            payment_method: string;
            status: string;
            user: User;
            card_masked_pan: string | null;
      };
      eventId: string;
}
