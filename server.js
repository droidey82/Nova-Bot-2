const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

app.get('/api/fresh-funded', async (req, res) => {
  try {
    const response = await fetch('https://public-api.birdeye.so/defi/tokenlist', {
      headers: {
        'x-api-key': process.env.BIRDEYE_API_KEY
      }
    });

    const data = await response.json();
    console.log('✅ Birdeye tokenlist received:', JSON.stringify(data, null, 2));

    // Filter only Solana tokens with liquidity and price
    const tokens = data.data
      ?.filter(t => t.chain === 'solana' && t.liquidity && t.price)
      .slice(0, 15)
      .map(t => ({
        name: t.name,
        symbol: t.symbol,
        price: parseFloat(t.price).toFixed(5),
        liquidity: Math.round(t.liquidity),
        volume: Math.round(t.volume_usd_24h || 0)
      }));

    res.json({
      message: '✅ Solana tokens from Birdeye',
      tokens: tokens || []
    });

  } catch (err) {
    console.error('❌ Birdeye fetch failed:', err);
    res.status(500).json({ error: 'Failed to fetch from Birdeye' });
  }
});

app.use((req, res) => {
  res.status(404).send('Route not found');
});

app.listen(PORT, () => {
  console.log(`✅ Solana Token API live on port ${PORT}`);
});
