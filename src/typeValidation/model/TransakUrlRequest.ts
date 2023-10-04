import { ParsedQs } from 'qs';

export class GetTransakPayUrlRequest {
  private readonly _walletAddress: string;
  private readonly _fiatCurrency: string;
  private readonly _cryptoCurrency: string;
  private readonly _amount: string;
  private readonly _network: string;

  constructor(fiatCurrency: string, cryptoCurrency: string, amount: string, network: string, walletAddress: string) {
    this._fiatCurrency = fiatCurrency;
    this._cryptoCurrency = cryptoCurrency;
    this._amount = amount;
    this._walletAddress = walletAddress;
    this._network = network;
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
}

export function toDtoTransak(query: ParsedQs): GetTransakPayUrlRequest {
  const fiatCurrency = query.fiatCurrency as string;
  const cryptoCurrency = query.cryptoCurrency as string;
  const amount = query.amount as string;
  const network = query.network as string;
  const walletAddress = query.walletAddress as string;

  return new GetTransakPayUrlRequest(
    fiatCurrency,
    cryptoCurrency,
    amount,
    network,
    walletAddress,
  );
}
