import { NextFunction, Request, Response } from "express";
import { ProviderQuotes } from "../../typeValidation/types";
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
            const responsePromises: Promise<ProviderQuotes>[] = [
                  fetchMoonpayAvailability(userIp),
                  fetchMercuryoAvailability(userIp),
                  fetchTransakAvailability(userIp),
            ];
            const responses = await Promise.allSettled(responsePromises);

            const dataPromises: ProviderQuotes[] = responses.reduce((accumulator, response) => {
                  if (response.status === "fulfilled") {
                        return [...accumulator, response.value];
                  }
                  return accumulator;
            }, []);

            const availabilityMapping: { [provider: string]: boolean } = {};
            dataPromises.forEach((item) => (availabilityMapping[item.code] = item.result));

            return res.status(200).json({ result: availabilityMapping });
      } catch (error) {
            next(error);
      }
};

export const fetchProviderAvailabilityGet = async (req: Request, res: Response, next: NextFunction) => {
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
            const responsePromises: Promise<ProviderQuotes>[] = [
                  fetchMoonpayAvailability(userIp),
                  fetchMercuryoAvailability(userIp),
                  fetchTransakAvailability(userIp),
            ];
            const responses = await Promise.allSettled(responsePromises);

            const dataPromises: ProviderQuotes[] = responses.reduce((accumulator, response) => {
                  if (response.status === "fulfilled") {
                        return [...accumulator, response.value];
                  }
                  return accumulator;
            }, []);

            const availabilityMapping: { [provider: string]: boolean } = {};
            dataPromises.forEach((item) => (availabilityMapping[item.code] = item.result));

            return res.status(200).json({ result: availabilityMapping });
      } catch (error) {
            next(error);
      }
};
