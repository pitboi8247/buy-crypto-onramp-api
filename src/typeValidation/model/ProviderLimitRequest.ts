import { ParsedQs } from 'qs';

export class GetProviderLimitRequest {
  private readonly _fiatCurrency: string;
  private readonly _cryptoCurrency: string;
  private readonly _network: number;

  constructor(fiatCurrency: string, cryptoCurrency: string, network: number) {
    this._fiatCurrency = fiatCurrency;
    this._cryptoCurrency = cryptoCurrency;
    this._network = network;
  }

  get fiatCurrency(): string {
    return this._fiatCurrency;
  }
  get cryptoCurrency(): string {
    return this._cryptoCurrency;
  }
  get network(): number {
    return this._network;
  }
}

export function toDtoLimit(query: ParsedQs): GetProviderLimitRequest {
  const fiatCurrency = query.fiatCurrency as string;
  const cryptoCurrency = query.cryptoCurrency as string;
  const network = query.network as string;

  return new GetProviderLimitRequest(fiatCurrency, cryptoCurrency, Number(network));
}
