const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Portfolio = require('../models/Portfolio');

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.user.id }) || { holdings: [] };
    const totalValue = portfolio.holdings.reduce((sum, holding) => sum + (holding.currentValue || 0), 0);
    const formattedPortfolio = {
      totalValue,
      holdings: portfolio.holdings.map(holding => ({
        asset: holding.coin,
        amount: holding.quantity,
        price: holding.averageBuyPrice,
        value: holding.currentValue || 0,
        change_24h: (Math.random() * 5 - 2.5).toFixed(2) + '%', // Mock for now
      })),
    };
    res.json(formattedPortfolio);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching portfolio' });
  }
});

router.post('/portfolio/update', async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne({ userId: req.user.id });
    if (!portfolio) {
      portfolio = new Portfolio({ userId: req.user.id, holdings: [], orders: [] });
    }
    // Update logic (e.g., merge req.body.holdings)
    if (req.body.holdings) {
      portfolio.holdings = req.body.holdings.map(h => ({
        coin: h.coin,
        quantity: h.quantity,
        averageBuyPrice: h.price,
        currentValue: h.quantity * h.price, // Calculate current value
      }));
    }
    await portfolio.save();
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: 'Error updating portfolio' });
  }
});

module.exports = router;