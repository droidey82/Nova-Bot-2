const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express(); // <--- THIS must be declared BEFORE using app.get()
const PORT = process.env.PORT || 3000;

app.use(cors());

// Your route goes below
app.get('/api/fresh-funded', async (req, res) => {
  try {
    const response = await fetch('https://api.dexscreener.com/latest/dex/pairs', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const data = await response.json();

    const filtered = data.pairs
      .filter(p => p.chainId === 'solana' && p.volume?.h24 > 20000)
      .slice(0, 10)
      .map(p => ({
        name: p.baseToken.name,
        symbol: p.baseToken.symbol,
        price: parseFloat(p.priceUsd).toFixed(5),
        volume: p.volume?.h24,
        url: p.url
      }));

    res.json({ message: '✅ Live Dex data', tokens: filtered });
  } catch (err) {
    console.error('Dex fetch failed:', err);
    res.status(500).json({ error: 'Failed to fetch token data from DexScreener' });
  }
});

app.use((req, res) => {
  res.status(404).send('Route not found');
});

app.listen(PORT, () => {
  console.log(`✅ Nova-Bot backend running on port ${PORT}`);
});
