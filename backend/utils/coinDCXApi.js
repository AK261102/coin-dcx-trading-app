const axios = require('axios');

const COINDCX_BASE_URL = 'https://api.coindcx.com';

const coinDCXApi = {
  getMarketData: async () => {
    try {
      const response = await axios.get(`${COINDCX_BASE_URL}/exchange/ticker`, {
        timeout: 5000 // timeout to avoid hanging
      });

      const formattedData = response.data.slice(0, 10).map(item => ({
        symbol: item.market,
        price: item.last_price,
        volume: item.volume
      }));

      return formattedData;
    } catch (error) {
      console.error('❌ CoinDCX API error:', error.message);

      // Mock fallback for dev/demo
      if (process.env.NODE_ENV !== 'production') {
        console.log('⚠️ Returning mock data for development');
        return [
          { symbol: 'BTCINR', price: '3500000', volume: '1000' },
          { symbol: 'ETHINR', price: '250000', volume: '800' },
          { symbol: 'SOLINR', price: '15000', volume: '300' }
        ];
      }

      throw new Error('Failed to fetch market data');
    }
  }
};

module.exports = coinDCXApi;
