import { ParsedQs } from "qs";

export class GetMercuryoSignatureRequest {
      private readonly _walletAddress: string;

      constructor(walletAddress: string) {
            this._walletAddress = walletAddress;
      }

      get walletAddress(): string {
            return this._walletAddress;
      }
}

export function toDtoMercuryo(query: ParsedQs): GetMercuryoSignatureRequest {
      const walletAddress = query.walletAddress as string;
      return new GetMercuryoSignatureRequest(walletAddress);
}
