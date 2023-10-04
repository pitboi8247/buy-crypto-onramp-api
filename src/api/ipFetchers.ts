import axios from 'axios';
import config from '../config/config';
import { ProviderQuotes } from '../typeValidation/types';
const geoip = require('geoip-lite');

export async function fetchMoonpayAvailability(userIp: string): Promise<ProviderQuotes> {
  // Fetch data from endpoint 2
  try {
    const response = await axios.get(
      `https://api.moonpay.com/v4/ip_address?apiKey=${config.moonpayLiveKey}&ipAddress=${userIp}`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );
    const result = response.data;
    return { code: 'MoonPay', result: result, error: false };
  } catch (error) {
    return { code: 'MoonPay', result: error.response.data, error: true };
  }
}

export async function fetchMercuryoAvailability(userIp: string): Promise<ProviderQuotes> {
  // Fetch data from endpoint 2
  try {
    const response = await axios.get(`https://api.mercuryo.io/v1.6/public/data-by-ip?ip=${userIp}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const result = response.data.data;
    return { code: 'Mercuryo', result: result, error: false };
  } catch (error) {
    return { code: 'Mercuryo', result: error.response.data, error: true };
  }
}

export const fetchIpDetails = async (req, res) => {
  const ipAddress =
    req.headers['cf-connecting-ip'] ||
    req.headers['x-real-ip'] ||
    req.headers['x-forwarded-for'] ||
    req.socket.remoteAddress ||
    '';

  const geo = geoip.lookup(ipAddress);

  const country = geo ? geo.country : null;
  const state = geo && geo.country === 'US' ? geo.region : null;

  const response = {
    ipAddress,
    country,
    state,
  };

  res.json(response);
};
