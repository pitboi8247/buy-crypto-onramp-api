import { ParsedQs } from 'qs';

export class GetProviderQuotesRequest {
  private readonly _fiatCurrency: string;
  private readonly _cryptoCurrency: string;
  private readonly _fiatAmount: number;
  private readonly _network: number;

  constructor(fiatCurrency: string, cryptoCurrency: string, fiatAmount: number, network: number) {
    this._fiatCurrency = fiatCurrency;
    this._cryptoCurrency = cryptoCurrency;
    this._fiatAmount = fiatAmount;
    this._network = network;
  }

  get fiatCurrency(): string {
    return this._fiatCurrency;
  }
  get cryptoCurrency(): string {
    return this._cryptoCurrency;
  }
  get fiatAmount(): number {
    return this._fiatAmount;
  }
  get network(): number {
    return this._network;
  }
}

export function toDtoQuotes(query: ParsedQs): GetProviderQuotesRequest {
  const fiatCurrency = query.fiatCurrency as string;
  const cryptoCurrency = query.cryptoCurrency as string;
  const fiatAmount = query.fiatAmount as string;
  const network = query.network as string;

  return new GetProviderQuotesRequest(
    fiatCurrency,
    cryptoCurrency,
    Number(fiatAmount),
    Number(network),
  );
}
