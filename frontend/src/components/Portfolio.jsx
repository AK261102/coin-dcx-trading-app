import React from 'react';

const Portfolio = ({ portfolio, loading }) => {
  if (loading) return <p>Loading portfolio...</p>;
  if (!portfolio) return <p>No portfolio data available.</p>;

  return (
    <div>
      <h2>Portfolio</h2>
      <p>Your cryptocurrency holdings and performance</p>
      <h3>Total Value</h3>
      <p style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '15px' }}>
        ${portfolio.totalValue.toLocaleString()}
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{ fontWeight: '600' }}>Assets</span>
        <span style={{ fontWeight: '600' }}>Allocation</span>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['asset', 'amount', 'price', 'value', 'change_24h'].map(header => (
              <th
                key={header}
                style={{ padding: '12px', backgroundColor: '#f8f9fa', borderBottom: '2px solid #ddd' }}
              >
                {header.charAt(0).toUpperCase() + header.slice(1).replace('_', ' ')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {portfolio.holdings.map((holding, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px' }}>{holding.asset}</td>
              <td style={{ padding: '12px' }}>{holding.amount}</td>
              <td style={{ padding: '12px' }}>${holding.price.toFixed(2)}</td>
              <td style={{ padding: '12px' }}>${holding.value.toLocaleString()}</td>
              <td
                style={{
                  padding: '12px',
                  color: holding.change_24h.includes('-') ? '#e74c3c' : '#27ae60'
                }}
              >
                {holding.change_24h}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Portfolio;