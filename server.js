const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // required for external API call
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/api/fresh-funded', async (req, res) => {
  try {
    const response = await fetch('https://api.dexscreener.com/latest/dex/pairs/solana');
    const data = await response.json();

    // Filter tokens (example: volume > 20k USD in last 24h)
    const filtered = data.pairs.filter(p => p.volume?.h24 > 20000);

    // Extract basic fields for frontend display
    const tokens = filtered.slice(0, 10).map(p => ({
      name: p.baseToken.name,
      symbol: p.baseToken.symbol,
      price: parseFloat(p.priceUsd).toFixed(5),
      volume: p.volume?.h24,
      url: p.url
    }));

    res.json({ message: '✅ Live Dex data', tokens });
  } catch (err) {
    console.error('Dex fetch failed:', err);
    res.status(500).json({ error: 'Failed to fetch token data from DexScreener' });
  }
});

app.use((req, res) => {
  res.status(404).send('Route not found');
});

app.listen(PORT, () => {
  console.log(`✅ Nova-Bot backend live at http://localhost:${PORT}`);
});
