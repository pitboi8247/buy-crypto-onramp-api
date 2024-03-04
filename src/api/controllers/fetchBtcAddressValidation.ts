import { NextFunction } from "express";
import { validateBitcoinAddress } from "../btcValidator";
import { Response } from "express";
import { Request } from "express";
import {
      GetBtcAddressValidationRequest,
      toDtoUserBtcValidation,
} from "../../typeValidation/model/BitcoinAddressValidationRequest";
import { ValidateBitcoinAddressRes } from "../../typeValidation/validation";

export const fetchBtcAddressValidation = async (req: Request, res: Response, next: NextFunction) => {
      const request: GetBtcAddressValidationRequest = toDtoUserBtcValidation(req.query);
      const validationResult = ValidateBitcoinAddressRes(request);

      if (!validationResult.success) {
            throw new Error(validationResult.data as string);
      }

      try {
            const isAddressValid = validateBitcoinAddress(request.address, request.network);
            return res.json({ result: isAddressValid });
      } catch (error: any) {
            return next(error);
      }
};
