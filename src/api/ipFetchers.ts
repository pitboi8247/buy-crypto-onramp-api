import axios from "axios";
import config from "../config/config";
import { ProviderQuotes } from "../typeValidation/types";
import { App } from "./../app";
import geoip from "geoip-lite";
import { whereAlpha2 } from "iso-3166-1";
import { CountryInfo } from "./types";

const findCountryByAlpha2 = (
      alpha2Code: string,
      alpha3: string,
      name: string,
      response: CountryInfo[]
) => {
      const matchingCountry = response.find(
            (countryInfo) =>
                  [countryInfo.alpha2, countryInfo.alpha3, countryInfo.name.toLowerCase()].includes(
                        alpha2Code.toLowerCase()
                  ) ||
                  countryInfo.alpha3 === alpha3 ||
                  countryInfo.name.toLowerCase() === name.toLowerCase()
      );
      return {
            allowed: matchingCountry?.isAllowed ?? false,
            countryAllowStatus: matchingCountry ?? ["country info not found"],
      };
};

export async function fetchMoonpayAvailability(userIp: string): Promise<ProviderQuotes> {
      try {
            const response = await axios.get(
                  `https://api.moonpay.com/v4/ip_address?apiKey=${config.moonpayProdApiKeyKey}&ipAddress=${userIp}`,
                  {
                        headers: {
                              Accept: "application/json",
                              "Content-Type": "application/json",
                        },
                  }
            );
            const result = response.data;

            App.log.info(`User IP info MoonPay: ${JSON.stringify(result)}`);
            return { code: "MoonPay", result: result.isAllowed, error: false };
      } catch (error) {
            // console.log(error);
            App.log.error(`Error fetching MoonPay availability: ${error}`);
            return { code: "MoonPay", result: false, error: true };
      }
}

export async function fetchMercuryoAvailability(userIp: string): Promise<ProviderQuotes> {
      try {
            const response = await axios.get(
                  `https://api.mercuryo.io/v1.6/public/data-by-ip?ip=${userIp}`,
                  {
                        headers: {
                              Accept: "application/json",
                              "Content-Type": "application/json",
                        },
                  }
            );
            const result = response.data.data;

            App.log.info(`User IP info Mercuryo: ${JSON.stringify(result)}`);
            return { code: "Mercuryo", result: result.country.enabled, error: false };
      } catch (error) {
            console.log(error);
            App.log.error(`Error fetching Mercuryo availability: ${error}`);
            return { code: "Mercuryo", result: false, error: true };
      }
}

export async function fetchTransakAvailability(userIp: string): Promise<ProviderQuotes> {
      try {
            const response = await axios.get("https://api-stg.transak.com/api/v2/countries", {
                  headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                  },
            });

            const result = response.data.response;
            const geo = geoip.lookup(userIp);

            if (!geo || !geo?.country) {
                  throw new Error("geo locale not available");
            }

            const { country, alpha2, alpha3 } = whereAlpha2(geo.country);
            const { allowed, countryAllowStatus } = findCountryByAlpha2(alpha2, alpha3, country, result);

            App.log.info(`User IP info Transak: ${JSON.stringify(countryAllowStatus)}`);
            return { code: "Transak", result: allowed, error: false };
      } catch (error) {
            App.log.error(`Error fetching Transak availability: ${error}`);
            return { code: "Transak", result: false, error: true };
      }
}

export const fetchIpDetails = async (req, res) => {
      const ipAddress =
            req.headers["x-forwarded-for"] ||
            req.headers["x-real-ip"] ||
            req.headers["cf-connecting-ip"] ||
            req.socket.remoteAddress ||
            "";

      const response = {
            ipAddress,
      };

      res.json(response);
};
