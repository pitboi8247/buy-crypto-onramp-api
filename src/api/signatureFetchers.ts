import type { NextFunction, Request, Response } from "express";

import crypto from "crypto";
import config from "../config/config";
import { MOONPAY_TEST_URL, MOONPAY_URL } from "../config/constants";

import { type GetTransakPayUrlRequest, toDtoTransak } from "../typeValidation/model/TransakUrlRequest";
import { ValidateGetTransakUrlRequest } from "../typeValidation/validation";
import { populateMoonPayUrlLegacy, populateTransakUrl } from "../utils/rsa_sig";

export const generateMercuryoSig = async (req: Request, res: Response, next: NextFunction) => {
      const mercuryoParams = req.body;
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
      const moonPayParams = req.body as any; //: GetMoonPaySignedUrlRequest = toDto(req.body);
      // const validationResult = ValidateGetMoonPaySignedUrlRequest(moonPayParams);

      // console.log(validationResult);

      // if (!validationResult.success) {
      //       throw new Error(validationResult.data as string);
      // }
      try {
            const moonPayTradeUrl = populateMoonPayUrlLegacy(moonPayParams as any);
            const isTestEnviornment = config.env === "development";

            const originalUrl = `${
                  isTestEnviornment ? MOONPAY_TEST_URL : MOONPAY_URL
            }${moonPayTradeUrl}`;

            const signature = crypto
                  .createHmac(
                        "sha256",
                        config.env === "development"
                              ? config.moonpayTestSecretKey
                              : config.moonpayProdSecretKey
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
            const transakUrl = populateTransakUrl(transakParams as any);
            res.json({ urlWithSignature: transakUrl });
      } catch (error) {
            next(error);
      }
};
