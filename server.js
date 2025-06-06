const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/api/fresh-funded', async (req, res) => {
  try {
    res.json({
      message: '✅ API is live',
      tokens: [
        { name: "MemeCoinX", symbol: "MCX", price: 0.0021 },
        { name: "SolPumper", symbol: "PUMP", price: 0.0049 }
      ]
    });
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.use((req, res) => {
  res.status(404).send('Route not found');
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
