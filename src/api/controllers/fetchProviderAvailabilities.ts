import type { NextFunction, Request, Response } from "express";
import type { ProviderQuotes } from "../../typeValidation/types";
import {
      fetchMercuryoAvailability,
      fetchMoonpayAvailability,
      fetchTransakAvailability,
} from "../ipFetchers";
import config from "../../config/config";

export const fetchProviderAvailability = async (req: Request, res: Response, next: NextFunction) => {
      const userIp = (req.headers["x-forwarded-for"] ||
            req.headers["x-real-ip"] ||
            req.headers["cf-connecting-ip"] ||
            req.socket.remoteAddress ||
            "") as string;

      if (config.env === "development")
            return res.status(200).json({
                  result: {
                        MoonPay: true,
                        Mercuryo: true,
                        Transak: true,
                  },
            });
      try {
            const availabilityMapping: { [provider: string]: boolean } = {};

            const responsePromises: Promise<ProviderQuotes>[] = [
                  fetchMoonpayAvailability(userIp),
                  fetchMercuryoAvailability(userIp),
                  fetchTransakAvailability(userIp),
            ];
            const responses = await Promise.allSettled(responsePromises);

            const dataPromises: ProviderQuotes[] = responses
                  .filter((response) => response.status === "fulfilled")
                  .map((response) => (response.status === "fulfilled" ? response.value : null))
                  .filter((value): value is ProviderQuotes => value !== null);

            // biome-ignore lint/complexity/noForEach: <explanation>
            dataPromises.forEach((item) => {
                  availabilityMapping[item.code] = item.result;
            });

            return res.status(200).json({ result: availabilityMapping });
      } catch (error) {
            next(error);
      }
};
