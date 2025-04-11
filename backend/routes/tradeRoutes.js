const express = require('express');
const router = express.Router();
const coinDCXApi = require('../utils/coinDCXApi');
const Portfolio = require('../models/Portfolio');
const authMiddleware = require('../middleware/auth');

// POST /api/trade/order
router.post('/order', authMiddleware, async (req, res, next) => {
  try {
    const { coin, quantity, type } = req.body;

    if (!coin || !quantity || !type) {
      return res.status(400).json({ message: 'Missing required trade fields' });
    }

    const tradeConfirmation = {
      tradeId: Math.random().toString(36).substring(2),
      coin,
      quantity: parseFloat(quantity),
      type,
      timestamp: new Date()
    };

    console.log('Trade request received:', tradeConfirmation);

    // Find or create portfolio for the user
    let portfolio = await Portfolio.findOne({ userId: req.user.id });
    if (!portfolio) {
      portfolio = new Portfolio({ userId: req.user.id, holdings: [], orders: [] });
      console.log('New portfolio created for user:', req.user.id);
    }

    // Fetch market data
    let marketData;
    try {
      marketData = await coinDCXApi.getMarketData();
      if (!marketData || !Array.isArray(marketData)) {
        throw new Error('Invalid market data format');
      }
    } catch (marketError) {
      console.error('Market data fetch error:', marketError.message);
      return res.status(500).json({ message: 'Unable to fetch current market prices. Please try again later.' });
    }

    const marketItem = marketData.find(item => item.symbol === coin);
    if (!marketItem) {
      return res.status(400).json({ message: `No market data available for ${coin}` });
    }
    const currentPrice = parseFloat(marketItem.price) || 0;

    if (currentPrice <= 0) {
      return res.status(400).json({ message: `Invalid price for ${coin}` });
    }

    const holdingIndex = portfolio.holdings.findIndex(h => h.coin === coin);
    if (holdingIndex > -1) {
      const existingHolding = portfolio.holdings[holdingIndex];
      if (type === 'buy') {
        const newQuantity = existingHolding.quantity + parseFloat(quantity);
        const newAveragePrice = ((existingHolding.averageBuyPrice * existingHolding.quantity) + (parseFloat(quantity) * currentPrice)) / newQuantity;
        portfolio.holdings[holdingIndex] = {
          coin,
          quantity: newQuantity,
          averageBuyPrice: newAveragePrice,
          currentValue: newQuantity * currentPrice
        };
        console.log(`Updated holding for ${coin}:`, portfolio.holdings[holdingIndex]);
      } else if (type === 'sell') {
        if (existingHolding.quantity < parseFloat(quantity)) {
          return res.status(400).json({ message: 'Insufficient quantity to sell' });
        }
        const newQuantity = existingHolding.quantity - parseFloat(quantity);
        if (newQuantity === 0) {
          portfolio.holdings.splice(holdingIndex, 1);
          console.log(`Removed holding for ${coin}`);
        } else {
          portfolio.holdings[holdingIndex] = {
            coin,
            quantity: newQuantity,
            averageBuyPrice: existingHolding.averageBuyPrice,
            currentValue: newQuantity * currentPrice
          };
          console.log(`Updated holding for ${coin} after sell:`, portfolio.holdings[holdingIndex]);
        }
      }
    } else if (type === 'buy') {
      portfolio.holdings.push({
        coin,
        quantity: parseFloat(quantity),
        averageBuyPrice: currentPrice,
        currentValue: parseFloat(quantity) * currentPrice
      });
      console.log(`Added new holding for ${coin}:`, portfolio.holdings[portfolio.holdings.length - 1]);
    } else {
      return res.status(400).json({ message: 'Cannot sell a coin not in portfolio' });
    }

    // Save the updated portfolio
    await portfolio.save();
    console.log('Portfolio saved successfully:', portfolio);

    res.status(201).json(tradeConfirmation);
  } catch (error) {
    console.error('Error placing order:', error.message);
    next(error);
  }
});




// GET /api/trade/market-data
router.get('/market-data', async (req, res) => {
  try {
    const marketData = await coinDCXApi.getMarketData();
    res.json(marketData);
  } catch (error) {
    console.error('Error fetching market data:', error.message);
    res.status(500).json({ message: 'Error fetching market data' });
  }
});

module.exports = router;


module.exports = router;