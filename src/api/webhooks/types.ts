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
