const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 10000;

// 🔐 Hardcoded Birdeye API key (for testing only)
const API_KEY = 'd8a70f437fdf4ffd9dbedfab89d79537';

app.use(cors());

app.get('/api/fresh-funded', async (req, res) => {
  try {
    const response = await fetch('https://public-api.birdeye.so/defi/tokenlist?chain=solana', {
      headers: {
        'X-API-KEY': API_KEY
      }
    });

    const data = await response.json();
    console.log("🧪 Raw Birdeye response:", data);

    if (!data.tokens || !Array.isArray(data.tokens)) {
      return res.status(500).json({ error: 'Unexpected Birdeye response format' });
    }

    // Filter tokens with 24h volume > 20k
    const filtered = data.tokens.filter(p => p.volume_24h && p.volume_24h > 20000);

    // Return top 10 tokens with minimal fields
    const results = filtered.slice(0, 10).map(p => ({
      name: p.name,
      symbol: p.symbol,
      price: p.price_usd
    }));

    res.json({ tokens: results });
  } catch (err) {
    console.error("Birdeye fetch failed:", err);
    res.status(500).json({ error: 'Failed to fetch token data' });
  }
});

app.use((req, res) => {
  res.status(404).send('Route not found');
});

app.listen(PORT, () => {
  console.log(`✅ Solana Token API live on port ${PORT}`);
});
