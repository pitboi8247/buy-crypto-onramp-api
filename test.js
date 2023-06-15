const axios = require('axios');

const MOONPAY_EBDPOINT = `https://api.moonpay.com/v3/currencies/`;
const MERCURYO_ENDPOINT = `https://api.mercuryo.io/v1.6/widget/buy/rate`;

async function fetchMercuryoQuote(fiatCurrency, cryptoCurrency, amount) {
  // Fetch data from endpoint 2
  try {
    const response = await axios.get(
      `${MERCURYO_ENDPOINT}?from=${fiatCurrency.toUpperCase()}&to=${cryptoCurrency.toUpperCase()}&amount=${
        amount
      }&widget_id=308e14df-01d7-4f35-948c-e17fa64bbc0d`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );
    const result = response.data;
    return { status: 'MERCURYO', result: result, error: false };
  } catch (error) {
    return { code: 'MERCURYO', result: error, error: true };
  }
}

// for bsc connect we need to axios.get our own custom api endpoint as even get requests require
// sig validation

const getMercuryoSig = async () => {
  try {
    // const res = await axios.get('http://localhost:8081/generate-mercuryo-sig', {
  
    //   method: 'GET',
    //   params: {
    //     walletAddress: "0x13E7f71a3E8847399547CE127B8dE420B282E4E4",
    //   }
    // });
    const res = await fetchMercuryoQuote('USD', 'ETH', '100')
    const result = res;
    console.log(result);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const verifyMercuryoSig = async () => {
  const payload = {
  
    method: 'POST',
    message: `${'0x13E7f71a3E8847399547CE127B8dE420B282E4E4'}${'9r8egtsb27bzr101em7uw7zhcrlwdbp'}`
  }
  const config = {
    headers:{
      'x-api-signature': 'Yf8rJ6yXol3kKURB9lj1kG1LGA1UYCv9xQE3hrHXpEQ='
    }
  };
  try {
    const res = await axios.post('http://localhost:8080/generate-mercuryo-sig', payload, config);
    const result = res.data;
    console.log(result);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const getMoonPaySig = async () => {

  const MOONPAY_SUPPORTED_CURRENCY_CODES = [
    'eth',
    'eth_arbitrum',
    'eth_optimism',
    'eth_polygon',
    'weth',
    'wbtc',
    'matic_polygon',
    'polygon',
    'usdc_arbitrum',
    'usdc_optimism',
    'usdc_polygon',
  ]
  const p = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    type: 'MOONPAY',
    defaultCurrencyCode: 'eth',
    baseCurrencyCode: 'usd',
    baseCurrencyAmount: '30',
    redirectUrl: 'https://pancakeswap.finance',
    theme: 'light',
    walletAddresses: JSON.stringify(
      MOONPAY_SUPPORTED_CURRENCY_CODES.reduce(
        (acc, currencyCode) => ({
          ...acc,
          [currencyCode]: '0x13E7f71a3E8847399547CE127B8dE420B282E4E4',
        }),
        {},
      ),
    ),
  }
  try {
    const res = await axios.post('http://localhost:8081/generate-moonpay-sig', p
     );
    const result = res.data;
    console.log(result);
  } catch (error) {
    console.error('Error fetching data:', error.data);
  }
};

const generateBscSig = async () => {
  const payload = {
  
    fiatCurrency: 'USD',
          cryptoCurrency: 'BTC',
          fiatAmount: '100',
          cryptoNetwork: 'BSC',
          paymentMethod: 'CARD',
  }
  try {
    const res = await axios.post('https://pcs-onramp-api.com/fetch-bsc-quote', payload);
    const result = res;
    console.log(result.error);
  } catch (error) {
    console.error('Error fetching data:', error.data);
  }
};

const fetchBSCQuote = async () => {
  const payload = {
  
    fiatCurrency: 'USD',
          cryptoCurrency: 'ETH',
          fiatAmount: '100',
         
  }
  try {
    const res = await axios.post('https://pcs-onramp-api.com/fetch-mercuryo-quote', payload);
    const result = res;
    console.log(result.data.result);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
fetchBSCQuote()
