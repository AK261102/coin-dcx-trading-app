import React, { useState, useEffect } from 'react';
import TradeForm from '../components/TradeForm';
import Portfolio from '../components/Portfolio';
import MarketData from '../components/MarketData';
import api from '../services/api'; // Assuming you have an API service
import '../styles/Dashboard.css'; // Import Dashboard-specific CSS

const Dashboard = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch initial portfolio data
  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const response = await api.get('/portfolio');
      setPortfolio(response.data);
    } catch (err) {
      console.error('Portfolio fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Callback to update portfolio after a trade
  const handleTradeSuccess = async () => {
    await fetchPortfolio(); // Refetch portfolio to reflect the latest changes
  };

  return (
    <div className="dashboard-container">
      <h1>CoinDCX Trading Dashboard</h1>
      <div className="trade-section">
        <TradeForm onTradeSuccess={handleTradeSuccess} />
      </div>
      <div className="market-section">
        <MarketData />
      </div>
      <div className="portfolio-section">
        <Portfolio portfolio={portfolio} loading={loading} />
      </div>
    </div>
  );
};

export default Dashboard;