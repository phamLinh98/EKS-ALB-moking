const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/data', (req, res) => {
  res.json({
    message: 'Hello from EKS!',
    timestamp: new Date().toISOString(),
    items: [
      { id: 1, name: 'Item A', price: 10.99 },
      { id: 2, name: 'Item B', price: 24.50 },
      { id: 3, name: 'Item C', price: 5.00 }
    ]
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));