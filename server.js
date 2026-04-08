// ============================================
// 💖 Date Invitation Backend — Express + Telegram Bot API
// ============================================

const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// --- Telegram Config ---
const BOT_TOKEN = process.env.BOT_TOKEN || "8707563999:AAH8MUG8JOtxr-3IxGmcMtaELBLqFENmWAE";
const CHAT_ID = process.env.CHAT_ID || "7437967842";
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files from /public
app.use(express.static(path.join(__dirname, "public")));

// --- API: Accept date invitation ---
app.post("/api/accept", async (req, res) => {
  const { date, time } = req.body;

  if (!date || !time) {
    return res.status(400).json({ error: "Date and time are required." });
  }

  // Format the Telegram message
  const message =
    `💖 She said YES!\n` +
    `📅 Date: ${date}\n` +
    `⏰ Time: ${time}`;

  try {
    const response = await fetch(TELEGRAM_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });

    const result = await response.json();

    if (result.ok) {
      return res.json({ success: true, message: "Message sent!" });
    } else {
      console.error("Telegram error:", result);
      return res.status(500).json({ error: "Failed to send Telegram message." });
    }
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// Fallback: serve index.html for any other route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`💖 Date invitation server running at http://localhost:${PORT}`);
});
