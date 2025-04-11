const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  holdings: [{
    coin: String,
    quantity: Number,
    averageBuyPrice: Number,
    currentValue: Number,
  }],
  orders: [{
    type: String,
    coin: String,
    quantity: Number,
    price: Number,
    timestamp: Date,
    status: String, // e.g., 'pending', 'filled', 'cancelled'
  }],
});

module.exports = mongoose.model('Portfolio', portfolioSchema);