import React, { useState, useEffect } from 'react';
import api from '../services/api';

const MarketData = () => {
  const [marketData, setMarketData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarketData();
  }, []);

  const fetchMarketData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/trade/market-data');
      if (Array.isArray(response.data)) {
        setMarketData(response.data);
        setError(null);
      } else {
        throw new Error('Invalid data format received from server');
      }
    } catch (err) {
      console.error('Market data fetch error:', err);
      setMarketData([]);
      setError(err.response?.data?.message || err.message || 'Error fetching market data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading market data...</div>;

  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      <h2>Market Data</h2>
      {marketData.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyle}>Symbol</th>
              <th style={thStyle}>Price</th>
              <th style={thStyle}>Volume</th>
            </tr>
          </thead>
          <tbody>
            {marketData.map((data, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                <td style={tdStyle}>{data.symbol}</td>
                <td style={tdStyle}>₹{parseFloat(data.price).toLocaleString()}</td>
                <td style={tdStyle}>{parseFloat(data.volume).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No market data available.</div>
      )}
    </div>
  );
};

const thStyle = {
  padding: '12px',
  backgroundColor: '#f8f9fa',
  borderBottom: '2px solid #ddd',
  textAlign: 'left'
};

const tdStyle = {
  padding: '12px'
};

export default MarketData;
