const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/api/fresh-funded", async (req, res) => {
  try {
    const apiUrl = "https://onchain-0cdba6d4ed17.herokuapp.com/api-v1/fresh-funded";
    const response = await fetch(apiUrl);
    const data = await response.text();

    res.status(response.status);
    res.set("Content-Type", response.headers.get("content-type") || "application/json");
    res.send(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Proxy fetch failed", details: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Solana Token API live on port ${port}`);
});
