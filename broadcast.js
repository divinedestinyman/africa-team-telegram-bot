/**
 * AFRICA TEAM — TELEGRAM BROADCAST ENGINE
 * ========================================
 * Posts daily signals, news, and product updates
 * to all Africa Team Telegram channels automatically.
 * 
 * Integrates with n8n Content Swarm — receives webhook
 * from n8n when new content is ready, then distributes.
 */

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const express = require('express');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
const app = express();
app.use(express.json());

// Channel IDs — add your actual channel IDs here
const CHANNELS = {
  coinverse:   process.env.COINVERSE_CHANNEL_ID,   // e.g. @CoinverseSignal or -100xxxxxxxxxx
  utrading:    process.env.UTRADING_CHANNEL_ID,
  eropia:      process.env.EROPIA_CHANNEL_ID,
  kindflow:    process.env.KINDFLOW_CHANNEL_ID,
  africateam:  process.env.AFRICATEAM_CHANNEL_ID,
};

// ── BROADCAST TEMPLATES ───────────────────────────────────────────────────────
const DAILY_TEMPLATES = {
  coinverse: (data) => `🔮 *Coinverse Daily Signal*
📅 ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}

${data.signal || '📈 BTC prediction market is LIVE. Will it go up or down today?'}

💡 *Coach's take:* ${data.insight || 'Market sentiment is building. This is the time to position.'}

🎯 Make your prediction now:
🔗 https://coinverse-landing.vercel.app/

💰 New here? Get 100 USDW FREE on signup!
📢 t.me/CoinverseSignal`,

  utrading: (data) => `🤖 *UTrading AI — Daily Report*
📅 ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}

${data.signal || '⚡ AI has been active — scanning 50+ pairs across multiple timeframes.'}

📊 *Today\'s AI focus:* ${data.pairs || 'BTC/USDT, ETH/USDT, SOL/USDT'}
🎯 *Strategy active:* ${data.strategy || 'Trend following + momentum'}

🚀 Your AI trader never sleeps:
🔗 https://utrading.ai/AFRICA
💳 Code: AFRICA

🌍 Africa Team | @CoinverseSignal`,

  eropia: (data) => `⚡ *Eropia DeFi — Pool Update*
📅 ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}

💹 *ERO Protocol Status:* Healthy ✅
🔥 *Burns today:* 20% of all purchases burned permanently
💧 *Pool health:* Self-healing — every sell strengthens the pool

${data.insight || '💰 Every day you\'re not staking is compounding you\'re missing.'}

💰 Staking (12X returns): eropia.finance?ref=AFRICA → Code: AFRICA
💎 NFTs ($125/month): eropia.finance?ref=U13F93855 → Code: U13F93855

🌍 Africa Team`,

  kindflow: (data) => `💝 *KindFlow — Community Update*
📅 ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}

🌱 *KindCoin mining is live*
📊 200M total supply | Mine-only | Cannot be bought

${data.insight || 'The best time to accumulate KindCoin is NOW — before the community grows and mining becomes more competitive.'}

💡 Every kindness plan purchase = KindCoin mining rewards
Start from just $25 USDT BEP20

📱 Message Coach to get your referrer ID:
wa.me/256784277664

🌍 Africa Team`,

  africateam: (data) => `🌍 *Africa Team — Daily Briefing*
📅 ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}

${data.headline || '💼 4 income streams. Running simultaneously. Building Africa\'s financial future.'}

*Today\'s opportunity:*
🔮 Coinverse → coinverse-landing.vercel.app (100 USDW free)
🤖 UTrading → utrading.ai/AFRICA (code AFRICA)  
⚡ Eropia → eropia.finance?ref=AFRICA (12X returns)
💝 KindFlow → from $25 USDT BEP20

📢 Africa Team Channel:
whatsapp.com/channel/0029VaYj81GLSmbe9xU1zh3i

💬 Questions? Ask the AI bot: /start`
};

// ── BROADCAST FUNCTION ────────────────────────────────────────────────────────
async function broadcast(channelId, message, options = {}) {
  if (!channelId) return { success: false, reason: 'no channel ID configured' };
  try {
    const result = await bot.sendMessage(channelId, message, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
      ...options
    });
    return { success: true, message_id: result.message_id };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ── DAILY BROADCAST (called by n8n cron) ─────────────────────────────────────
async function runDailyBroadcast(data = {}) {
  const results = {};
  for (const [product, channelId] of Object.entries(CHANNELS)) {
    if (!channelId) { results[product] = { skipped: true }; continue; }
    const template = DAILY_TEMPLATES[product];
    if (!template) continue;
    const message = template(data[product] || {});
    results[product] = await broadcast(channelId, message);
    await new Promise(r => setTimeout(r, 1000)); // 1s delay between posts
  }
  return results;
}

// ── WEBHOOK ENDPOINTS (n8n calls these) ──────────────────────────────────────

// POST /broadcast/daily — trigger daily broadcasts with optional content
app.post('/broadcast/daily', async (req, res) => {
  const data = req.body || {};
  const results = await runDailyBroadcast(data);
  res.json({ status: 'ok', results });
});

// POST /broadcast/single — send to one specific channel
app.post('/broadcast/single', async (req, res) => {
  const { product, message } = req.body;
  if (!product || !message) return res.status(400).json({ error: 'product and message required' });
  const channelId = CHANNELS[product];
  const result = await broadcast(channelId, message);
  res.json({ status: 'ok', result });
});

// POST /broadcast/all — same message to all channels
app.post('/broadcast/all', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'message required' });
  const results = {};
  for (const [product, channelId] of Object.entries(CHANNELS)) {
    if (!channelId) continue;
    results[product] = await broadcast(channelId, message);
    await new Promise(r => setTimeout(r, 1000));
  }
  res.json({ status: 'ok', results });
});

// POST /broadcast/alert — urgent alert to all channels + Coach
app.post('/broadcast/alert', async (req, res) => {
  const { message, products } = req.body;
  if (!message) return res.status(400).json({ error: 'message required' });
  const targets = products || Object.keys(CHANNELS);
  const results = {};
  for (const product of targets) {
    const channelId = CHANNELS[product];
    if (!channelId) continue;
    results[product] = await broadcast(channelId, `🚨 URGENT\n\n${message}`);
  }
  // Also alert Coach
  if (process.env.COACH_CHAT_ID) {
    await bot.sendMessage(process.env.COACH_CHAT_ID, `🚨 Alert sent to channels:\n\n${message}`);
  }
  res.json({ status: 'ok', results });
});

// GET /health
app.get('/health', (req, res) => res.json({
  status: 'ok',
  channels: Object.fromEntries(Object.entries(CHANNELS).map(([k, v]) => [k, !!v])),
  timestamp: new Date().toISOString()
}));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`📡 Africa Team Broadcast Engine running on port ${PORT}`));
