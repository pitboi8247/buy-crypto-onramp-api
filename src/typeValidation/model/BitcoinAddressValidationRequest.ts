import { ParsedQs } from "qs";
import { Network } from "../validateBitcoinAddress";

export class GetBtcAddressValidationRequest {
      private readonly _address: string;
      private readonly _network: Network;

      constructor(address: string, network: Network) {
            this._address = address;
            this._network = network;
      }

      get address(): string {
            return this._address;
      }
      get network(): Network {
            return this._network;
      }
}

export function toDtoUserBtcValidation(query: ParsedQs): GetBtcAddressValidationRequest {
      const address = query.address as string;
      const network = query.network as Network;
      return new GetBtcAddressValidationRequest(address, network);
}
