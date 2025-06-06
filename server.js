const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/api/fresh-funded', async (req, res) => {
  try {
    const response = await fetch('https://public-api.birdeye.so/public/tokenlist');
    const data = await response.json();

    const filtered = data.tokens
      .filter(p => p.volume_usd_24h > 20000)
      .slice(0, 10)
      .map(p => ({
        name: p.name,
        symbol: p.symbol,
        price: parseFloat(p.price).toFixed(5),
        volume: Math.round(p.volume_usd_24h),
        liquidity: Math.round(p.liquidity_usd)
      }));

    res.json({ message: '✅ Birdeye data', tokens: filtered });
  } catch (err) {
    console.error('Birdeye fetch failed:', err);
    res.status(500).json({ error: 'Failed to fetch from Birdeye' });
  }
});

app.use((req, res) => {
  res.status(404).send('Route not found');
});

app.listen(PORT, () => {
  console.log(`✅ Solana Token API live on port ${PORT}`);
});
