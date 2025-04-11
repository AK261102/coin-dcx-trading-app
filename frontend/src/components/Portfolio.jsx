import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, ResponsiveContainer
} from 'recharts';
import api from '../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a29bfe', '#fd79a8'];

const Portfolio = ({ portfolio, loading }) => {
  const [darkMode, setDarkMode] = useState(() =>
    localStorage.getItem('darkMode') === 'true'
  );
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [history, setHistory] = useState([]);
;

  // Auto-refresh mechanism
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => window.location.reload(), 5000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Generate mock 7-day historical data
  useEffect(() => {
    if (!portfolio) return;
    const today = new Date();
    const mockHistory = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - i));
      return {
        timestamp: date.toISOString().split('T')[0],
        totalValue: Math.round(portfolio.totalValue * (0.9 + Math.random() * 0.2)) // 90–110%
      };
    });
    setHistory(mockHistory);
  }, [portfolio]);

  if (loading) return <p>Loading portfolio...</p>;
  if (!portfolio) return <p>No portfolio data available.</p>;

  const pieData = portfolio.holdings.map((h) => ({
    name: h.asset,
    value: h.value,
  }));

  const barData = portfolio.holdings.map((h) => ({
    asset: h.asset,
    quantity: h.amount,
  }));

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '20px' }}>
        <button onClick={() => setAutoRefresh(!autoRefresh)}>
          {autoRefresh ? '⏸ Stop Auto Refresh' : '🔁 Start Auto Refresh'}
        </button>
      </div>

      <h2>Portfolio</h2>
      <p>Your cryptocurrency holdings and performance</p>
      <h3>Total Value</h3>
      <p style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '15px' }}>
        ₹{portfolio.totalValue.toLocaleString()}
      </p>

      {/* Pie Chart */}
      <div style={{ width: '100%', height: 300, marginBottom: '40px' }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} (${(percent * 100).toFixed(0)}%)`
              }
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div style={{ width: '100%', height: 300, marginBottom: '40px' }}>
        <ResponsiveContainer>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="asset" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="quantity" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart - Historical Value (Mocked) */}
      <div style={{ width: '100%', height: 300, marginBottom: '40px' }}>
        <h4>Portfolio Value Over Time</h4>
        <ResponsiveContainer>
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalValue"
              stroke={darkMode ? '#00cec9' : '#8884d8'}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
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
                style={{
                  padding: '12px',
                  backgroundColor: '#f8f9fa',
                  borderBottom: '2px solid #ddd'
                }}
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
              <td style={{ padding: '12px' }}>₹{holding.price.toFixed(2)}</td>
              <td style={{ padding: '12px' }}>₹{holding.value.toLocaleString()}</td>
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
