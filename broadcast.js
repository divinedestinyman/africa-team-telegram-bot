/**
 * AFRICA TEAM — TELEGRAM BROADCAST ENGINE
 * Posts daily updates to all 5 channels via webhook from n8n
 */
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
const app = express();
app.use(express.json());

const CHANNELS = {
  coinverse:  process.env.COINVERSE_CHANNEL_ID  || '@CoinverseSignal',
  utrading:   process.env.UTRADING_CHANNEL_ID   || '@utradingsignals',
  eropia:     process.env.EROPIA_CHANNEL_ID      || '@eropiachannnel',
  kindflow:   process.env.KINDFLOW_CHANNEL_ID    || '@kindflow',
  africateam: process.env.AFRICATEAM_CHANNEL_ID  || '@africateamhub',
};

async function broadcast(channelId, message) {
  if (!channelId) return { success: false, reason: 'no channel ID' };
  try {
    const r = await bot.sendMessage(channelId, message, { parse_mode: 'Markdown', disable_web_page_preview: true });
    return { success: true, message_id: r.message_id };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

app.post('/broadcast/daily', async (req, res) => {
  const data = req.body || {};
  const results = {};
  for (const [product, channelId] of Object.entries(CHANNELS)) {
    if (!channelId) continue;
    const message = data[product]?.message || data.message || `🌍 Africa Team daily update for ${product}`;
    results[product] = await broadcast(channelId, message);
    await new Promise(r => setTimeout(r, 1000));
  }
  res.json({ status: 'ok', results });
});

app.post('/broadcast/single', async (req, res) => {
  const { product, message } = req.body;
  if (!product || !message) return res.status(400).json({ error: 'product and message required' });
  res.json({ status: 'ok', result: await broadcast(CHANNELS[product], message) });
});

app.post('/broadcast/all', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'message required' });
  const results = {};
  for (const [product, channelId] of Object.entries(CHANNELS)) {
    results[product] = await broadcast(channelId, message);
    await new Promise(r => setTimeout(r, 1000));
  }
  res.json({ status: 'ok', results });
});

app.get('/health', (req, res) => res.json({
  status: 'ok',
  channels: Object.fromEntries(Object.entries(CHANNELS).map(([k,v]) => [k, !!v])),
  timestamp: new Date().toISOString()
}));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`📡 Broadcast engine on port ${PORT}`));
