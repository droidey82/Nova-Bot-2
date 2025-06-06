const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
  // Allow all origins, or replace '*' with your domain for stricter security
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/api/fresh-funded', async (req, res) => {
  try {
    const response = await fetch('https://onchain-0cdba6d4ed17.herokuapp.com/api-v1/fresh-funded', {
      method: 'GET',
      headers: {
        // Add any headers if needed, e.g. Authorization
      }
    });
    if (!response.ok) {
      return res.status(response.status).send(`Error fetching API: ${response.statusText}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching fresh-funded:', error);
    res.status(500).send('Internal server error');
  }
});

app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});
