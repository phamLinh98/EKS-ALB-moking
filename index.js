const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const EXTERNAL_API = 'https://69c7e29563393440b3173c68.mockapi.io/api/mocking/employee';
const TIMEOUT_MS = 5000;

// ─── Health Endpoints ────────────────────────────────────────

// livenessProbe: app còn respond không?
app.get('/health/live', (req, res) => {
  res.json({ status: 'ok', version: '6.0' });
});

// readinessProbe: app sẵn sàng nhận traffic không?
app.get('/health/ready', (req, res) => {
  // Không check mockapi.io vì đó là external service
  // Chỉ check internal dependencies (DB, cache...)
  res.json({ status: 'ready', version: '6.0' });
});

// startupProbe: app đã init xong chưa?
app.get('/health/startup', (req, res) => {
  res.json({ status: 'started', version: '6.0' });
});

// ─── Business APIs ───────────────────────────────────────────

app.get('/api/data', async (req, res) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(EXTERNAL_API, {
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(502).json({
        error: 'external_api_error',
        message: `External API returned ${response.status}`,
        version: '6.0'
      });
    }

    const data = await response.json();
    return res.json({
      version: '6.0',
      source: 'mockapi.io',
      count: data.length,
      data
    });

  } catch (err) {
    // Timeout hoặc network error
    if (err.name === 'AbortError') {
      return res.status(503).json({
        error: 'external_api_timeout',
        message: 'External API timed out after 5s',
        version: '6.0'
      });
    }
    return res.status(503).json({
      error: 'external_api_unavailable',
      message: 'Cannot reach external API',
      version: '6.0'
    });
  }
});

app.get('/api/products', (req, res) => {
  res.json({
    version: '6.0',
    products: [
      { id: 1, name: 'Product A', stock: 100 },
      { id: 2, name: 'Product B', stock: 50 },
    ]
  });
});

app.get('/api/orders', (req, res) => {
  res.json({
    version: '6.0',
    orders: [
      { id: 1, product: 'Product A', qty: 3 },
      { id: 2, product: 'Product B', qty: 1 },
    ]
  });
});

app.listen(PORT, () => console.log(`Server v6.0 running on port ${PORT}`));