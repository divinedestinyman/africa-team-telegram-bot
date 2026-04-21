/**
 * AFRICA TEAM — MASTER TELEGRAM BOT (@AfricaTeamBot)
 * ====================================================
 * Self-optimising, multi-product AI coaching bot
 * Covers: Coinverse | UTrading AI | Eropia | KindFlow | Africa Team
 *
 * Channels:
 *   @CoinverseSignal | @utradingsignals | @eropiachannnel | @kindflow | @africateamhub
 */

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// ── CONFIGURATION ──────────────────────────────────────────────────────────────
const CONFIG = {
  TELEGRAM_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  ANTHROPIC_KEY:  process.env.ANTHROPIC_API_KEY,
  COACH_CHAT_ID:  process.env.COACH_CHAT_ID,

  // Channel IDs — from Railway env vars with fallback defaults
  CHANNELS: {
    coinverse:  process.env.COINVERSE_CHANNEL_ID  || '@CoinverseSignal',
    utrading:   process.env.UTRADING_CHANNEL_ID   || '@utradingsignals',
    eropia:     process.env.EROPIA_CHANNEL_ID      || '@eropiachannnel',
    kindflow:   process.env.KINDFLOW_CHANNEL_ID    || '@kindflow',
    africateam: process.env.AFRICATEAM_CHANNEL_ID  || '@africateamhub',
  },

  PRODUCTS: {
    coinverse: {
      name: 'Coinverse',
      tagline: 'Predict Crypto. Earn Real Rewards.',
      link: 'https://coinverse-landing.vercel.app/',
      tg_channel: 'https://t.me/CoinverseSignal',
      wa_channel: 'https://whatsapp.com/channel/0029VaYj81GLSmbe9xU1zh3i',
      airdrop: '100 USDW free on signup',
      keywords: ['COINVERSE','PREDICT','USDW','AIRDROP','PREDICTION','MARKET'],
      emoji: '🔮',
      faq: {
        'how do i start':      '1️⃣ Click the link below\n2️⃣ Sign up — get *100 USDW FREE*\n3️⃣ Make your first prediction\n4️⃣ Earn rewards when right!\n\n🔗 https://coinverse-landing.vercel.app/',
        'what is usdw':        'USDW is Coinverse\'s reward token. Every new signup gets *100 USDW airdropped instantly* — no deposit needed. You earn more by predicting correctly.',
        'how do i withdraw':   'Withdrawals go directly to your connected wallet — instant. Minimum amount depends on your account level.',
        'is it free':          'Yes! Signing up is completely *free* and you get 100 USDW instantly. No credit card, no deposit required to start.',
        'what can i predict':  'BTC, ETH, BNB, SOL and many more — predict price direction (up or down) over different time periods.',
      }
    },
    utrading: {
      name: 'UTrading AI',
      tagline: 'AI Trades Crypto For You 24/7',
      link: 'https://utrading.ai/AFRICA',
      referral_code: 'AFRICA',
      tg_bot: 'https://t.me/uTrading_AI_Bot?start=ref-AFRICA',
      wa_channel: 'https://whatsapp.com/channel/0029VaYj81GLSmbe9xU1zh3i',
      keywords: ['UTRADING','AI TRADING','AUTO TRADE','BOT TRADE','TRADING BOT','AFRICA CODE'],
      emoji: '🤖',
      faq: {
        'how do i start':        '1️⃣ Download UTrading AI\n2️⃣ Register using code *AFRICA*\n3️⃣ Fund your account\n4️⃣ Activate AI — it trades 24/7!\n\n🔗 https://utrading.ai/AFRICA',
        'what is the code':      'Your referral code is: *AFRICA* 🌍\nUse it when registering to join Coach\'s Africa Team group.',
        'how does the ai trade': 'The AI analyses RSI, MACD, volume, and sentiment 24/7 then executes trades automatically. Zero experience needed.',
        'minimum investment':    'Check the UTrading AI platform for current minimums. Start small and scale as you see results.',
        'is it safe':            'UTrading AI uses automated risk management including stop-losses. All trading carries risk but the AI manages it for you.',
      }
    },
    eropia: {
      name: 'Eropia DeFi 4.0',
      tagline: 'Stake USDC. Earn Up to 12X.',
      link_staking: 'https://eropia.finance?ref=AFRICA',
      link_nft:     'https://eropia.finance?ref=U13F93855',
      code_staking: 'AFRICA',
      code_nft:     'U13F93855',
      wa_channel: 'https://whatsapp.com/channel/0029VaYj81GLSmbe9xU1zh3i',
      keywords: ['EROPIA','ERO','DEFI','STAKING','STAKE','ERO NFT','12X','BASE CHAIN','USDC'],
      emoji: '⚡',
      faq: {
        'how do i start':    '2 options:\n\n💰 *STAKING* (up to 12X):\neropia.finance?ref=AFRICA → Code: *AFRICA*\n\n💎 *NFTs* ($30 each, $125/month):\neropia.finance?ref=U13F93855 → Code: *U13F93855*\n\nWhich interests you — staking or NFTs?',
        'minimum':           'Staking: Check eropia.finance for current minimum.\nNFTs: $30 per NFT, earns $125/month each.',
        'how much can i earn':'Staking: Up to *12X* your USDC over 12 months. *2X minimum guaranteed.*\nNFTs: $125/month per $30 NFT = 5000% annual return.',
        'what wallet':       'Use MetaMask or Coinbase Wallet on *Base Chain* network, funded with USDC.',
        'is it safe':        'Eropia was assessed by Claude AI as *mathematically sustainable*. 10 security layers, immutable contracts, self-healing pools. 2X minimum guaranteed by Catch-Up Fund.',
        'staking or nft':    'Staking → you have USDC to invest, want 12X over 12 months.\nNFTs → you want monthly passive income from a $30 entry.\nWhat\'s your budget and goal?',
      }
    },
    kindflow: {
      name: 'KindFlow',
      tagline: 'Give Kindness. Build Wealth.',
      link: 'https://user.kindflow.world/register?sponsor=0x13f93855D5131E0e58eFb9AeB96036ED5a14F077',
      wa_channel: 'https://whatsapp.com/channel/0029VaYj81GLSmbe9xU1zh3i',
      keywords: ['KINDFLOW','KIND COIN','KINDCOIN','CROWDFUND','P2P','BSC','KINDNESS','KIND'],
      emoji: '💝',
      faq: {
        'how do i start':    '3 Steps:\n1️⃣ Choose your plan ($25 minimum)\n2️⃣ Load *USDT BEP20* in TrustWallet/MetaMask\n3️⃣ Message Coach for your referrer ID\n\n📱 wa.me/256784277664',
        'what is kindcoin':  'KindCoin — 200M supply, *cannot be bought*, only MINED through giving. Every kindness plan earns KindCoin. Early miners get the best advantage before public listing.',
        'how much earn':     'Plans $25–$8,000. Maximum depth potential: $29.9 million. Start small, accumulate KindCoin while it\'s cheap.',
        'is it legit':       '100% decentralised P2P — *no admin controls payments*. Smart contracts handle everything on Binance Smart Chain. Transparent — every transaction visible on-chain.',
        'what is usdt bep20':'USDT BEP20 is USDT on Binance Smart Chain. Get it on Binance exchange, withdraw to TrustWallet on BSC network.',
      }
    },
    africateam: {
      name: 'Africa Team',
      tagline: 'Multiple Income Streams. One Community.',
      wa_channel: 'https://whatsapp.com/channel/0029VaYj81GLSmbe9xU1zh3i',
      keywords: ['AFRICA TEAM','JOIN','COMMUNITY','COACH','START','HELP','INCOME','ALL PRODUCTS','HUB','WEBSITE'],
      emoji: '🌍',
    }
  },

  COACH_SYSTEM_PROMPT: `You are Coach's AI assistant for Africa Team — a crypto and income community built for Africa and the world.

Africa Team products:
1. Coinverse — prediction markets, 100 USDW free airdrop, link: https://coinverse-landing.vercel.app/
2. UTrading AI — AI crypto trading 24/7, referral code AFRICA, link: https://utrading.ai/AFRICA
3. Eropia DeFi 4.0 — stake USDC up to 12X returns. Staking code AFRICA (eropia.finance?ref=AFRICA). NFT code U13F93855 (eropia.finance?ref=U13F93855). 2X minimum guaranteed.
4. KindFlow — P2P crowdfunding on BSC, start from $25 USDT BEP20, mine KindCoin. Direct link: https://user.kindflow.world/register?sponsor=0x13f93855D5131E0e58eFb9AeB96036ED5a14F077
5. Africa Team community — WhatsApp channel: whatsapp.com/channel/0029VaYj81GLSmbe9xU1zh3i
6. Africa Team Hub (all products in one place): https://africateam-hub.vercel.app

Your role:
- Answer questions clearly and simply about any product
- Sound like Coach: confident, warm, direct, Africa-proud
- Always end with a relevant action step and link
- Never give financial advice — give information, let them decide
- Keep responses under 200 words
- Use emojis sparingly but effectively
- Unknown specifics → direct to Coach: wa.me/256784277664`
};

// ── BOT INITIALISATION ─────────────────────────────────────────────────────────
if (!CONFIG.TELEGRAM_TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN not set. Bot cannot start.');
  process.exit(1);
}

const bot = new TelegramBot(CONFIG.TELEGRAM_TOKEN, { polling: true });
console.log('🌍 Africa Team Bot starting...');

// ── PERFORMANCE LOG ────────────────────────────────────────────────────────────
const perfLog = [];
function log(type, product, query) {
  perfLog.push({ ts: Date.now(), type, product, query: query?.slice(0, 60) });
  if (perfLog.length > 1000) perfLog.shift();
}

// ── KEYWORD ROUTER ─────────────────────────────────────────────────────────────
function detectProduct(text) {
  const upper = text.toUpperCase();
  for (const [key, product] of Object.entries(CONFIG.PRODUCTS)) {
    if (product.keywords?.some(kw => upper.includes(kw))) return key;
  }
  return null;
}

// ── FAQ MATCHER ────────────────────────────────────────────────────────────────
function matchFAQ(productKey, text) {
  const faq = CONFIG.PRODUCTS[productKey]?.faq;
  if (!faq) return null;
  const lower = text.toLowerCase();
  for (const [q, a] of Object.entries(faq)) {
    const words = q.split(' ').filter(w => w.length > 3);
    if (lower.includes(q) || words.filter(w => lower.includes(w)).length >= Math.ceil(words.length * 0.6)) {
      return a;
    }
  }
  return null;
}

// ── AI CLAUDE COACH ────────────────────────────────────────────────────────────
async function askClaude(message, productContext) {
  if (!CONFIG.ANTHROPIC_KEY) {
    return '🤖 AI coach not configured yet. Message Coach directly: wa.me/256784277664';
  }
  try {
    const hint = productContext
      ? `User seems interested in ${CONFIG.PRODUCTS[productContext]?.name}.`
      : 'User has not specified a product.';
    const res = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      system: CONFIG.COACH_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: `${hint}\n\nUser: ${message}` }]
    }, {
      headers: {
        'x-api-key': CONFIG.ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      }
    });
    return res.data.content[0].text;
  } catch (e) {
    return '🤖 Let me connect you with Coach directly: wa.me/256784277664';
  }
}

// ── MESSAGE BUILDERS ───────────────────────────────────────────────────────────
function buildProductCard(key) {
  const cards = {
    coinverse: `🔮 *Coinverse*\n_Predict Crypto. Earn Real Rewards._\n\n✅ *100 USDW FREE* on signup — no deposit needed\n✅ BTC, ETH, SOL and more prediction markets\n✅ Real-time markets updated every minute\n✅ Earn instantly — no experience needed\n\n🔗 *Join now:* https://coinverse-landing.vercel.app/\n📢 *Signals:* t.me/CoinverseSignal\n\n_Reply HOW to get step-by-step instructions_`,

    utrading: `🤖 *UTrading AI*\n_AI Trades Crypto For You 24/7_\n\n✅ AI analyses markets every second\n✅ Automated risk management\n✅ Works while you sleep\n✅ Built for Africa — use code *AFRICA*\n\n🔗 *Join:* https://utrading.ai/AFRICA\n🤖 *Bot:* t.me/uTrading_AI_Bot?start=ref-AFRICA\n\n_Reply HOW to get step-by-step instructions_`,

    eropia: `⚡ *Eropia DeFi 4.0*\n_Stake USDC. Earn Up to 12X._\n\n✅ Up to *12X* return in 12 months\n✅ *2X minimum GUARANTEED*\n✅ Self-healing protocol — mathematically proven\n✅ NFTs from $30 earn $125/month each\n\n💰 *Staking:* eropia.finance?ref=AFRICA → Code: *AFRICA*\n💎 *NFTs:* eropia.finance?ref=U13F93855 → Code: *U13F93855*\n\n_Reply STAKING or NFT to learn more_`,

    kindflow: `💝 *KindFlow*\n_Give Kindness. Build Wealth._\n\n✅ 100% decentralised P2P on Binance Smart Chain\n✅ Start from just *$25 USDT BEP20*\n✅ Instant smart contract payouts to your wallet\n✅ Mine *KindCoin* before public listing!\n\n📱 *Contact Coach to join:* wa.me/256784277664\n\n_Reply HOW to get step-by-step instructions_`,

    africateam: `🌍 *Africa Team — Coach's Income Empire*\n_Multiple Income Streams. One Community._\n\n4 active income streams running simultaneously:\n\n🔮 *COINVERSE* — predict & earn (100 USDW free)\n🤖 *UTRADING* — AI trades for you (code AFRICA)\n⚡ *EROPIA* — stake USDC, earn up to 12X\n💝 *KINDFLOW* — give & receive from $25\n\n📢 *Join Africa Team:*\nwhatsapp.com/channel/0029VaYj81GLSmbe9xU1zh3i\n\n🔗 *Full hub:* https://africateam-hub.vercel.app\n\n_Which product interests you most?_`
  };
  return cards[key] || null;
}

function buildWelcome(firstName) {
  return `👋 Hello ${firstName || 'Champion'}!\n\n🌍 *Welcome to Africa Team Bot*\n\n_Coach's AI assistant for multiple income streams._\n\nWe run 4 active opportunities:\n🔮 *COINVERSE* — predict crypto, earn rewards\n🤖 *UTRADING* — AI trades 24/7 for you\n⚡ *EROPIA* — stake USDC, earn up to 12X\n💝 *KINDFLOW* — give kindness, build wealth\n\nTap a button or visit our hub 👇

🔗 https://africateam-hub.vercel.app`;
}

const MAIN_KEYBOARD = {
  inline_keyboard: [
    [{ text: '🔮 Coinverse', callback_data: 'product_coinverse' }, { text: '🤖 UTrading AI', callback_data: 'product_utrading' }],
    [{ text: '⚡ Eropia DeFi', callback_data: 'product_eropia' }, { text: '💝 KindFlow', callback_data: 'product_kindflow' }],
    [{ text: '🌍 Africa Team Hub', callback_data: 'product_africateam' }]
  ]
};

// ── SEND HELPER ────────────────────────────────────────────────────────────────
async function send(chatId, text, extra = {}) {
  try {
    return await bot.sendMessage(chatId, text, { parse_mode: 'Markdown', disable_web_page_preview: true, ...extra });
  } catch (e) {
    console.error('Send error:', e.message);
  }
}

// ── COMMANDS ───────────────────────────────────────────────────────────────────
bot.onText(/\/start/, async (msg) => {
  await send(msg.chat.id, buildWelcome(msg.from?.first_name), { reply_markup: MAIN_KEYBOARD });
  log('start', null, '/start');
});

bot.onText(/\/help/, async (msg) => {
  await send(msg.chat.id,
    `🆘 *Africa Team Help*\n\n*Commands:*\n/start — Welcome menu\n/products — All 4 income streams\n/coinverse — Coinverse info\n/utrading — UTrading AI info\n/eropia — Eropia DeFi info\n/kindflow — KindFlow info\n/coach — Contact Coach\n/signals — Signal channels\n\nOr just *type any question* — AI Coach answers 24/7 🧠`
  );
});

bot.onText(/\/products/, async (msg) => {
  await send(msg.chat.id,
    `💼 *Africa Team — 4 Income Streams*\n\n🔮 Coinverse — prediction markets, 100 USDW free\n🤖 UTrading AI — AI trading, code AFRICA\n⚡ Eropia — DeFi staking up to 12X\n💝 KindFlow — P2P crowdfunding from $25\n\nTap to explore:`,
    { reply_markup: MAIN_KEYBOARD }
  );
});

bot.onText(/\/coinverse/i, async (msg) => {
  await send(msg.chat.id, buildProductCard('coinverse'));
  log('command', 'coinverse', '/coinverse');
});

bot.onText(/\/utrading/i, async (msg) => {
  await send(msg.chat.id, buildProductCard('utrading'));
  log('command', 'utrading', '/utrading');
});

bot.onText(/\/eropia/i, async (msg) => {
  await send(msg.chat.id, buildProductCard('eropia'));
  log('command', 'eropia', '/eropia');
});

bot.onText(/\/kindflow/i, async (msg) => {
  await send(msg.chat.id, buildProductCard('kindflow'));
  log('command', 'kindflow', '/kindflow');
});

bot.onText(/\/coach/, async (msg) => {
  await send(msg.chat.id,
    `👨‍💼 *Contact Coach Directly*\n\n📱 WhatsApp: wa.me/256784277664\n📢 Africa Team Channel:\nwhatsapp.com/channel/0029VaYj81GLSmbe9xU1zh3i\n\nCoach answers questions, gives KindFlow referrer IDs, and helps you get started on any product.`
  );
});

bot.onText(/\/signals/, async (msg) => {
  await send(msg.chat.id,
    `📊 *Africa Team Signal Channels*\n\n🔮 Coinverse: t.me/CoinverseSignal\n🤖 UTrading: t.me/utradingsignals\n⚡ Eropia: t.me/eropiachannnel\n💝 KindFlow: t.me/kindflow\n🌍 Africa Team: t.me/africateamhub\n\n_Join all channels to never miss a signal._

🌍 *Full Africa Team Hub:* https://africateam-hub.vercel.app`
  );
});

// ── INLINE BUTTON CALLBACKS ────────────────────────────────────────────────────
bot.on('callback_query', async (query) => {
  await bot.answerCallbackQuery(query.id);
  const { data, message } = query;
  const chatId = message.chat.id;

  if (data.startsWith('product_')) {
    const key = data.replace('product_', '');
    const card = buildProductCard(key);
    if (card) {
      const p = CONFIG.PRODUCTS[key];
      const joinUrl = p?.link || p?.link_staking || p?.wa_channel;
      await send(chatId, card, {
        reply_markup: {
          inline_keyboard: [[
            { text: '❓ Ask a Question', callback_data: `ask_${key}` },
            ...(joinUrl ? [{ text: '🔗 Join Now', url: joinUrl }] : [])
          ]]
        }
      });
      log('button', key, data);
    }
  }

  if (data.startsWith('ask_')) {
    const key = data.replace('ask_', '');
    await send(chatId, `🧠 Ask me anything about *${CONFIG.PRODUCTS[key]?.name || key}*!\n\nType your question below and I'll answer immediately.`);
  }
});

// ── GROUP WELCOME ──────────────────────────────────────────────────────────────
bot.on('new_chat_members', async (msg) => {
  for (const member of msg.new_chat_members) {
    if (member.is_bot) continue;
    await send(msg.chat.id,
      `🌍 Welcome *${member.first_name}* to Africa Team!\n\nYou've joined a community building multiple income streams together. Type /start to explore all opportunities.`
    );
  }
});

// ── MAIN MESSAGE HANDLER ───────────────────────────────────────────────────────
bot.on('message', async (msg) => {
  if (!msg.text || msg.text.startsWith('/')) return;

  const chatId = msg.chat.id;
  const text = msg.text;
  const upper = text.toUpperCase().trim();

  // Eropia NFT sub-routing
  if ((upper.includes('EROPIA') || upper.includes('ERO')) &&
      (upper.includes('NFT') || upper.includes('U13F93855'))) {
    await send(chatId,
      `💎 *Eropia NFTs*\n\n✅ $30 per NFT\n✅ $125/month passive income\n✅ 50X cap = 5,000% return\n✅ 5% of every platform purchase → NFT holders\n\n🔗 *Buy NFTs:* eropia.finance?ref=U13F93855\n💳 *Code:* U13F93855`
    );
    log('eropia-nft', 'eropia', text);
    return;
  }

  // Detect product
  const product = detectProduct(text);

  // FAQ check
  if (product) {
    const faq = matchFAQ(product, text);
    if (faq) {
      await send(chatId, faq);
      log('faq', product, text);
      return;
    }
    // Short keyword hit — show product card
    if (text.trim().split(' ').length <= 3) {
      const card = buildProductCard(product);
      if (card) { await send(chatId, card); log('keyword', product, text); return; }
    }
  }

  // AI Claude coach for questions
  if (text.includes('?') || text.split(' ').length > 4) {
    await bot.sendChatAction(chatId, 'typing');
    const response = await askClaude(text, product);
    await send(chatId, response);
    log('ai-coach', product, text);
    return;
  }

  // Default — show menu
  await send(chatId, `🌍 *Africa Team Bot*\n\nChoose a product or ask any question:`, { reply_markup: MAIN_KEYBOARD });
  log('default', null, text);
});

// ── WEEKLY REPORT TO COACH ─────────────────────────────────────────────────────
setInterval(async () => {
  const now = new Date();
  if (now.getDay() !== 0 || now.getHours() !== 8 || now.getMinutes() !== 0) return;
  if (!CONFIG.COACH_CHAT_ID) return;

  const by = {};
  perfLog.forEach(e => { by[e.product || 'general'] = (by[e.product || 'general'] || 0) + 1; });
  const lines = Object.entries(by).sort((a,b)=>b[1]-a[1]).map(([p,c])=>`• ${p}: ${c}`).join('\n');

  await send(CONFIG.COACH_CHAT_ID,
    `📊 *Africa Team Bot — Weekly Report*\n\nTotal interactions: ${perfLog.length}\n\n${lines}\n\n_Data resets after this message._`
  );
  perfLog.length = 0;
}, 60000);

// ── ERROR HANDLING ─────────────────────────────────────────────────────────────
bot.on('polling_error', e => console.error('Poll error:', e.message));
process.on('uncaughtException', e => console.error('Uncaught:', e.message));
process.on('unhandledRejection', e => console.error('Unhandled:', e?.message));

console.log('✅ Africa Team Bot is live!');
console.log('Channels:', CONFIG.CHANNELS);
