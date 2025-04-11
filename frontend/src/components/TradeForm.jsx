import React, { useState } from 'react';
import api from '../services/api';

const TradeForm = ({ onTradeSuccess }) => {
  const [formData, setFormData] = useState({ coin: '', quantity: '', type: 'buy' });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/trade/order', formData);
      setError(null);
      alert('Order placed successfully');

      if (onTradeSuccess) onTradeSuccess();

      setFormData({ coin: '', quantity: '', type: 'buy' });
    } catch (err) {
      setError(err.response?.data?.message || 'Error placing order');
      console.error('Trade error:', err.response ? err.response.data : err.message);
    }
  };

  return (
    <div>
      <h2>Place Trade</h2>
      {error && <p className="error" style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Coin Symbol</label>
          <input
            type="text"
            value={formData.coin}
            onChange={(e) => setFormData({ ...formData, coin: e.target.value })}
            placeholder="e.g., BTCINR"
            required
          />
        </div>
        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            placeholder="e.g., 1"
            required
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label>Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>
        <button type="submit">Place Order</button>
      </form>
    </div>
  );
};

export default TradeForm;