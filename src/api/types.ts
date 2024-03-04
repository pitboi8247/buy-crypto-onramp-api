import { ONRAMP_PROVIDERS } from "../config/constants";

export enum TransactionStatus {
      Cancelled = "cancelled",
      Cancelling = "cancelling",
      FailedCancel = "failedCancel",
      Success = "completed",
      Failed = "failed",
      Pending = "pending",
      Replacing = "replacing",
      Unknown = "unknown",
      WaitingForAuthorization = "waitingAuthorization",
      // May want more granular options here later like InMemPool
}

export type TxSummary = {
      type: "buyCrypto";
      id: string;
      chainId: number;
      // TODO: move /components/buy/constants.ts to /constants/onramp
      // lib should not depend on components
      provider: keyof typeof ONRAMP_PROVIDERS;
      cryptoCurrency: any;
      fiatCurrency: any;
      status: TransactionStatus;
      // TODO: use string with iso format instead
      addedTime: number;
      providerFee: number;
      networkFee: number;
      synced: boolean;
};

export interface CountryInfo {
      alpha2: string;
      alpha3: string;
      isAllowed: boolean;
      isLightKycAllowed: boolean;
      name: string;
      supportedDocuments: string[];
      currencyCode: string;
      partners?: Partner[];
}

interface Partner {
      name: string;
      isCardPayment: boolean;
      currencyCode: string;
}
