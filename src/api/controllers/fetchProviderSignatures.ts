import crypto from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import config from "../../config/config";
import { MOONPAY_TEST_URL, MOONPAY_URL } from "../../config/constants";
import {
      type GetProviderSigRequest,
      toDtoProviderSig,
} from "../../typeValidation/model/ProxiedSigRequest";
import { ValidateProviderSigRequest } from "../../typeValidation/validation";
import { populateMercuryoUrl, populateMoonPayUrl, populateTransakUrl } from "../../utils/rsa_sig";

export const fetchProviderSignature = async (req: Request, res: Response, next: NextFunction) => {
      const request: GetProviderSigRequest = toDtoProviderSig(req.query);
      const validationResult = ValidateProviderSigRequest(request);

      if (!validationResult.success) {
            throw new Error(validationResult.data as string);
      }

      try {
            if (request.provider === "MoonPay") {
                  const moonPayTradeUrl = populateMoonPayUrl(request);
                  const isTestEnviornment = Boolean(config.env === "development");
                  const originalUrl = `${
                        isTestEnviornment ? MOONPAY_TEST_URL : MOONPAY_URL
                  }${moonPayTradeUrl}`;

                  const signature = crypto
                        .createHmac(
                              "sha256",
                              isTestEnviornment
                                    ? config.moonpayTestSecretKey
                                    : config.moonpayProdSecretKey
                        )
                        .update(new URL(originalUrl).search)
                        .digest("base64");

                  const returnData = `${originalUrl}&signature=${encodeURIComponent(signature)}`;
                  return res.json({ signature: returnData });
            }
            if (request.provider === "Mercuryo") {
                  const mercuryoTradeUrl = populateMercuryoUrl(request);

                  const hash = crypto
                        .createHash("sha512")
                        .update(`${request.walletAddress}${config.mercuryoSecretKey}`)
                        .digest("hex");

                  const returnData = `${mercuryoTradeUrl}&signature=${hash}`;
                  return res.json({ signature: returnData });
            }
            const transakUrl = populateTransakUrl(request);
            return res.json({ signature: transakUrl });
      } catch (error) {
            return next(error);
      }
};
