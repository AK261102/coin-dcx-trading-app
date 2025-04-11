const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const tradeRoutes = require('./routes/tradeRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./utils/errorHandler');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));
app.options('*', cors());

// Configure rate limiting with increased limit for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increase to 1000 requests per window (adjust as needed)
  message: 'Too many requests, please try again later.',
});

app.use(express.json());
app.use(limiter); // Apply rate limiter

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trade', tradeRoutes);
app.use('/api/portfolio', portfolioRoutes);

// Error handling
app.use(errorHandler);

connectDB();

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));