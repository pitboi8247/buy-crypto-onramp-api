import validate, { type Network } from "../typeValidation/validateBitcoinAddress";

type BtcValidationResponse = {
      code: number;
      result: boolean;
      error: boolean;
};

export function validateBitcoinAddress(address: string, network: Network): BtcValidationResponse {
      try {
            const isValidAddress = validate(address, network);
            return { code: 200, result: isValidAddress, error: false };
      } catch (error) {
            return { code: 404, result: false, error: true };
      }
}
