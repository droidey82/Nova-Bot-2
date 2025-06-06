const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/api/fresh-funded', async (req, res) => {
  try {
    const response = await fetch('https://public-api.birdeye.so/public/combined/trending');
    const data = await response.json();

    console.log('🧪 Trending tokens:', JSON.stringify(data, null, 2));

    const fresh = data.data?.newTokens?.slice(0, 10).map(token => ({
      name: token.name,
      symbol: token.symbol,
      price: parseFloat(token.price).toFixed(5),
      volume: Math.round(token.volume_usd_24h),
      liquidity: Math.round(token.liquidity_usd)
    }));

    res.json({
      message: '✅ Trending Solana tokens from Birdeye',
      tokens: fresh || []
    });

  } catch (err) {
    console.error('Birdeye trending fetch failed:', err);
    res.status(500).json({ error: 'Failed to fetch trending tokens' });
  }
});

app.use((req, res) => {
  res.status(404).send('Route not found');
});

app.listen(PORT, () => {
  console.log(`✅ Solana Token API live on port ${PORT}`);
});
