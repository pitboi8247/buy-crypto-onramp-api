import { NextFunction, Request, Response } from "express";
import { GetUserIpRequest, toDtoUserIp } from "../../typeValidation/model/UserIpRequest";
import { ProviderQuotes } from "../../typeValidation/types";
import { ValidateUserIpRequest } from "../../typeValidation/validation";
import {
      fetchMercuryoAvailability,
      fetchMoonpayAvailability,
      fetchTransakAvailability,
} from "../ipFetchers";

export const fetchProviderAvailability = async (req: Request, res: Response, next: NextFunction) => {
      const request: GetUserIpRequest = toDtoUserIp(req.body);
      const validationResult = ValidateUserIpRequest(request);

      if (!validationResult.success) {
            throw new Error(validationResult.data as string);
      }

      try {
            const responsePromises: Promise<ProviderQuotes>[] = [
                  fetchMoonpayAvailability(request.userIp),
                  fetchMercuryoAvailability(request.userIp),
                  fetchTransakAvailability(request.userIp),
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
      const request: GetUserIpRequest = toDtoUserIp(req.query);
      const validationResult = ValidateUserIpRequest(request);

      if (!validationResult.success) {
            throw new Error(validationResult.data as string);
      }

      try {
            const responsePromises: Promise<ProviderQuotes>[] = [
                  fetchMoonpayAvailability(request.userIp),
                  fetchMercuryoAvailability(request.userIp),
                  fetchTransakAvailability(request.userIp),
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
