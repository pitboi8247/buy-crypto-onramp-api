import { NextFunction, Request, Response } from "express";

import crypto from "crypto";
import config from "../../config/config";
import { MOONPAY_TEST_URL, MOONPAY_URL } from "../../config/constants";
import {
      GetMercuryoSignatureRequest,
      toDtoMercuryo,
} from "../../typeValidation/model/MercuryoSignatureRequest";
import { GetMoonPaySignedUrlRequest, toDto } from "../../typeValidation/model/MoonpaySignedUrlRequest";
import { GetTransakPayUrlRequest, toDtoTransak } from "../../typeValidation/model/TransakUrlRequest";
import {
      ValidateGetMercuryoSignatureRequest,
      ValidateGetMoonPaySignedUrlRequest,
      ValidateGetTransakUrlRequest,
} from "../../typeValidation/validation";
import { populateMoonPayUrl, populateTransakUrl } from "../../utils/rsa_sig";

export const generateMercuryoSig = async (req: Request, res: Response, next: NextFunction) => {
      const mercuryoParams: GetMercuryoSignatureRequest = toDtoMercuryo(req.body);
      const validationResult = ValidateGetMercuryoSignatureRequest(mercuryoParams);

      if (!validationResult.success) {
            throw new Error(validationResult.data as string);
      }
      try {
            const hash = crypto
                  .createHash("sha512")
                  .update(`${mercuryoParams.walletAddress}${config.mercuryoSecretKey}`)
                  .digest("hex");

            return res.json({ signature: hash });
      } catch (error) {
            next(error);
      }
};

export const generateMoonPaySig = async (req: Request, res: Response, next: NextFunction) => {
      const moonPayParams: GetMoonPaySignedUrlRequest = toDto(req.body);
      const validationResult = ValidateGetMoonPaySignedUrlRequest(moonPayParams);

      if (!validationResult.success) {
            throw new Error(validationResult.data as string);
      }
      try {
            const moonPayTradeUrl = populateMoonPayUrl(moonPayParams);

            const isTestEnviornment =
                  moonPayParams.isTestEnv && moonPayParams.isTestEnv === "development";

            const originalUrl = `${
                  isTestEnviornment ? MOONPAY_TEST_URL : MOONPAY_URL
            }${moonPayTradeUrl}`;

            const signature = crypto
                  .createHmac(
                        "sha256",
                        isTestEnviornment ? config.moonpayTestSecretKey : config.moonpaySecretKey
                  )
                  .update(new URL(originalUrl).search)
                  .digest("base64");

            const returnData = `${originalUrl}&signature=${encodeURIComponent(signature)}`;

            res.json({ urlWithSignature: returnData });
      } catch (error) {
            next(error);
      }
};

export const generateTransakSig = async (req: Request, res: Response, next: NextFunction) => {
      const transakParams: GetTransakPayUrlRequest = toDtoTransak(req.body);
      const validationResult = ValidateGetTransakUrlRequest(transakParams);

      if (!validationResult.success) {
            throw new Error(validationResult.data as string);
      }
      try {
            const transakUrl = populateTransakUrl(transakParams);

            res.json({ urlWithSignature: transakUrl });
      } catch (error) {
            next(error);
      }
};
