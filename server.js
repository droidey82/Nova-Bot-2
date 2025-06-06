// server.js

const express = require('express');
const cors = require('cors');
const app = express();

// Allow CORS for all origins
app.use(cors());

// Simple GET route for /api/fresh-funded
app.get('/api/fresh-funded', async (req, res) => {
  try {
    // TODO: Replace this with actual DexScreener fetch logic
    res.json({
      message: 'API working ✅',
      tokens: [] // Placeholder token list
    });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fallback for unknown routes
app.use((req, res) => {
  res.status(404).send('Route not found');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
