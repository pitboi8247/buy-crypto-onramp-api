import { GetProviderLimitRequest, toDtoLimit } from "../../typeValidation/model/ProviderLimitRequest";
import { ProviderQuotes } from "../../typeValidation/types";
import { ValidateeProviderLimitRequest } from "../../typeValidation/validation";
import {
      fetchLimitOfMer,
      fetchLimitOfMoonpay,
      fetchLimitOfTransak,
      getMinMaxAmountCap,
} from "../limitFetchers";
import { Request, Response } from "express";

export const fetchProviderLimits = async (req: Request, res: Response) => {
      const request: GetProviderLimitRequest = toDtoLimit(req.query);
      const validationResult = ValidateeProviderLimitRequest(request);

      if (!validationResult.success) {
            throw new Error(validationResult.data as string);
      }
      const { fiatCurrency, cryptoCurrency, network } = request;

      const responsePromises: Promise<ProviderQuotes>[] = [
            fetchLimitOfMoonpay(fiatCurrency, cryptoCurrency, network),
            fetchLimitOfMer(fiatCurrency, cryptoCurrency),
            fetchLimitOfTransak(fiatCurrency, cryptoCurrency, network),
      ];

      const responses = await Promise.allSettled(responsePromises);

      const dataPromises: ProviderQuotes[] = responses
            .reduce((accumulator, response) => {
                  if (response.status === "fulfilled") {
                        return [...accumulator, response.value];
                  }
                  console.error("Error fetching price quotes:", response.reason);
                  return accumulator;
            }, [])
            .filter((item) => typeof item !== "undefined");

      const validQuotes = dataPromises.filter((quote) => !quote.error).map((q) => q.result);
      const quotes = getMinMaxAmountCap(validQuotes);

      return res.status(200).json({ result: quotes });
};
