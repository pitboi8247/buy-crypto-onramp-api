import { SupportedProvider } from "../../config/constants";
import { ParsedQs } from "qs";

export class GetProviderSigRequest {
      private readonly _walletAddress: string;
      private readonly _externalTransactionId: string;
      private readonly _fiatCurrency: string;
      private readonly _cryptoCurrency: string;
      private readonly _amount: string;
      private readonly _network: string;
      private readonly _provider: SupportedProvider;
      private readonly _redirectUrl: string;

      constructor(
            fiatCurrency: string,
            cryptoCurrency: string,
            amount: string,
            network: string,
            walletAddress: string,
            provider: SupportedProvider,
            externalTransactionId: string,
            redirectUrl: string
      ) {
            this._fiatCurrency = fiatCurrency;
            this._cryptoCurrency = cryptoCurrency;
            this._amount = amount;
            this._walletAddress = walletAddress;
            this._network = network;
            this._provider = provider;
            this._externalTransactionId = externalTransactionId;
            this._redirectUrl = redirectUrl;
      }

      get walletAddress(): string {
            return this._walletAddress;
      }
      get fiatCurrency(): string {
            return this._fiatCurrency;
      }
      get cryptoCurrency(): string {
            return this._cryptoCurrency;
      }
      get amount(): string {
            return this._amount;
      }
      get network(): string {
            return this._network;
      }

      get redirectUrl(): string {
            return this._redirectUrl;
      }
      get provider(): SupportedProvider {
            return this._provider;
      }
      get externalTransactionId(): string {
            return this._externalTransactionId;
      }
}

export function toDtoProviderSig(query: ParsedQs): GetProviderSigRequest {
      const fiatCurrency = query.fiatCurrency as string;
      const cryptoCurrency = query.cryptoCurrency as string;
      const amount = query.amount as string;
      const network = query.network as string;
      const walletAddress = query.walletAddress as string;
      const externalTransactionId = query.externalTransactionId as string;
      const provider = query?.provider as SupportedProvider;
      const redirectUrl = query?.redirectUrl as string;

      return new GetProviderSigRequest(
            fiatCurrency,
            cryptoCurrency,
            amount,
            network,
            walletAddress,
            provider,
            externalTransactionId,
            redirectUrl
      );
}
