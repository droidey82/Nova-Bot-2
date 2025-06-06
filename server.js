const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/api/fresh-funded', async (req, res) => {
  try {
    const response = await fetch('https://public-api.birdeye.so/public/tokenlist');

    // Attempt to parse JSON
    const data = await response.json();

    // DEBUG: Log the full response
    console.log('🧪 Raw Birdeye response:', JSON.stringify(data, null, 2));

    // Send raw response to browser too
    res.json({
      message: '✅ Birdeye API Raw Response',
      raw: data
    });

  } catch (err) {
    console.error('Birdeye fetch failed:', err);
    res.status(500).json({ error: 'Failed to fetch from Birdeye' });
  }
});

// Fallback for unknown routes
app.use((req, res) => {
  res.status(404).send('Route not found');
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Solana Token API live on port ${PORT}`);
});
