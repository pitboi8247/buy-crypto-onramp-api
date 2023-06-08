const axios = require('axios');

const main = async () => {
  try {
    const res = await axios.post('http://localhost:8080/generate-bsc-sig', { 
        walletAddress: "0x13E7f71a3E8847399547CE127B8dE420B282E4E4",
        cryptoCurrency: 'BUSD',
        fiatCurrency: 'USD',
        amount: '100'
    });
    const result = res.data;
    console.log(result);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

main();
