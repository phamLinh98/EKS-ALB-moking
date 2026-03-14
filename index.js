const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// 🐛 BUG: /health luôn trả 500 → readinessProbe fail
// → progressDeadlineSeconds=30 hết hạn → K8s tự rollback
app.get('/health', (req, res) => {
  res.status(500).json({
    status: 'error',
    version: '5.0',
    message: 'App is broken!'
  });
});

app.get('/api/data', (req, res) => {
  res.json({
    message: 'Hello from EKS!',
    version: '5.0',
    timestamp: new Date().toISOString(),
    items: [
      { id: 1, name: 'Item A', price: 10.99 },
      { id: 2, name: 'Item B', price: 24.50 },
      { id: 3, name: 'Item C', price: 5.00 }
    ]
  });
});

app.get('/api/products', (req, res) => {
  res.json({
    version: '5.0',
    products: [
      { id: 1, name: 'Product A', stock: 100 },
      { id: 2, name: 'Product B', stock: 50 },
    ]
  });
});

// API mới version 5.0
app.get('/api/orders', (req, res) => {
  res.json({
    version: '5.0',
    orders: [
      { id: 1, product: 'Product A', qty: 3 },
      { id: 2, product: 'Product B', qty: 1 },
    ]
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));