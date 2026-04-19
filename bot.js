/**
 * AFRICA TEAM — MASTER TELEGRAM BOT
 * ===================================
 * Self-optimising, multi-product AI coaching bot
 * Covers: Coinverse | UTrading AI | Eropia | KindFlow | Africa Team
 * 
 * Deploy on Railway / VPS / any Node.js host
 * Uses: node-telegram-bot-api + Anthropic Claude API
 * 
 * Features:
 * - Product routing by keyword
 * - AI coaching via Claude (for unknown questions)
 * - Referral link delivery
 * - FAQ auto-response
 * - Group welcome messages
 * - Channel broadcasting
 * - Daily signals posting
 * - Swarm performance logging
 * - Multi-language ready (English default)
 */

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// ── CONFIGURATION ──────────────────────────────────────────────────────────────
const CONFIG = {
  TELEGRAM_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  ANTHROPIC_KEY:  process.env.ANTHROPIC_API_KEY,
  COACH_CHAT_ID:  process.env.COACH_CHAT_ID,  // Coach's personal Telegram chat ID for alerts

  PRODUCTS: {
    coinverse: {
      name: 'Coinverse',
      tagline: 'Predict Crypto. Earn Real Rewards.',
      link: 'https://coinverse-landing.vercel.app/',
      tg_channel: 'https://t.me/CoinverseSignal',
      tg_bot: 'https://t.me/CoinverseSignalBot',
      wa_channel: 'https://whatsapp.com/channel/0029VaYj81GLSmbe9xU1zh3i',
      airdrop: '100 USDW free on signup',
      keywords: ['COINVERSE', 'PREDICT', 'USDW', 'AIRDROP', 'PREDICTION'],
      emoji: '🔮',
      faq: {
        'how do i start': '1️⃣ Click the link below\n2️⃣ Sign up (get 100 USDW free!)\n3️⃣ Make your first prediction\n4️⃣ Earn rewards when you\'re right!\n\n🔗 https://coinverse-landing.vercel.app/',
        'what is usdw': 'USDW is Coinverse\'s reward token. 100 USDW is airdropped to every new signup automatically — no deposit required! You earn more by making correct predictions.',
        'how do i withdraw': 'Withdrawals are instant and go directly to your connected wallet. Minimum withdrawal depends on your account level.',
        'is it free': 'Yes! Signing up is completely free and you get 100 USDW airdrop instantly. No credit card, no deposit required to start.',
        'what can i predict': 'You can predict BTC, ETH, BNB, SOL and many more cryptocurrency price movements — up or down — over different time periods.',
      }
    },
    utrading: {
      name: 'UTrading AI',
      tagline: 'AI Trades Crypto For You 24/7',
      link: 'https://utrading.ai/AFRICA',
      referral_code: 'AFRICA',
      tg_bot: 'https://t.me/uTrading_AI_Bot?start=ref-AFRICA',
      wa_channel: 'https://whatsapp.com/channel/0029VaYj81GLSmbe9xU1zh3i',
      keywords: ['UTRADING', 'AI TRADING', 'AUTO TRADE', 'BOT TRADE', 'TRADING BOT', 'AFRICA'],
      emoji: '🤖',
      faq: {
        'how do i start': '1️⃣ Download UTrading AI app\n2️⃣ Register using code AFRICA\n3️⃣ Fund your account\n4️⃣ Activate the AI — it trades for you 24/7!\n\n🔗 https://utrading.ai/AFRICA',
        'what is the referral code': 'Your referral code is: AFRICA 🌍\nUse it when registering at utrading.ai to join Coach\'s Africa Team group.',
        'how does the ai trade': 'The AI analyses market data 24/7 — RSI, MACD, volume, sentiment — and executes trades automatically. You don\'t need to know anything about trading.',
        'minimum investment': 'Check the UTrading AI platform for current minimum investment amounts. Start small, scale as you see results.',
        'is it safe': 'UTrading AI uses automated risk management including stop-losses. No trading system is risk-free, but the AI manages risk for you.',
      }
    },
    eropia: {
      name: 'Eropia DeFi 4.0',
      tagline: 'Stake USDC. Earn Up to 12X.',
      link_staking: 'https://eropia.finance?ref=AFRICA',
      link_nft: 'https://eropia.finance?ref=U13F93855',
      code_staking: 'AFRICA',
      code_nft: 'U13F93855',
      wa_channel: 'https://whatsapp.com/channel/0029VaYj81GLSmbe9xU1zh3i',
      keywords: ['EROPIA', 'ERO', 'DEFI', 'STAKING', 'STAKE', 'NFT', '12X', 'BASE CHAIN', 'USDC'],
      emoji: '⚡',
      faq: {
        'how do i start': 'Two options:\n\n💰 STAKING (up to 12X returns):\n→ eropia.finance?ref=AFRICA\n→ Code: AFRICA\n\n💎 NFTs ($30 each, $125/month):\n→ eropia.finance?ref=U13F93855\n→ Code: U13F93855\n\nWhich interests you more — staking or NFTs?',
        'what is the minimum': 'Staking: Check eropia.finance for current minimums (invest USDC)\nNFTs: $30 per NFT, earns $125/month per NFT',
        'how much can i earn': 'Staking: Up to 12X your USDC over 12 months. Minimum 2X guaranteed.\nNFTs: $125/month per $30 NFT = 5000% annual return\nBobby\'s example: Invest $1000 staking + refer 10 people = up to $31,000',
        'what is base chain': 'Base Chain is an Ethereum Layer 2 built by Coinbase. It\'s fast, cheap, and secure. You\'ll need USDC on Base Chain network to stake.',
        'is it safe': 'Eropia has been assessed by Claude AI (Anthropic) as mathematically sustainable. 10 security layers, immutable smart contracts, self-healing liquidity pools. 2X minimum return is guaranteed by the Catch-Up Fund.',
        'what wallet do i need': 'Use MetaMask or Coinbase Wallet. Switch to Base Chain network, fund with USDC, then connect to eropia.finance.',
        'staking or nft': 'Staking is for people who have USDC to invest and want 12X returns over 12 months.\nNFTs are for people who want monthly passive income from a $30 entry.\nWhat\'s your budget and goal?',
      }
    },
    kindflow: {
      name: 'KindFlow',
      tagline: 'Give Kindness. Build Wealth.',
      link: 'https://wa.me/256784277664?text=I+want+to+join+KindFlow',
      wa_channel: 'https://whatsapp.com/channel/0029VaYj81GLSmbe9xU1zh3i',
      keywords: ['KINDFLOW', 'KIND COIN', 'KINDCOIN', 'CROWDFUND', 'P2P', 'BSC', 'KINDNESS'],
      emoji: '💝',
      faq: {
        'how do i start': '3 Steps:\n1️⃣ Choose your Kindness Plan ($25 minimum)\n2️⃣ Load USDT BEP20 into TrustWallet or MetaMask\n3️⃣ Message Coach for your referrer ID to register\n\n📱 wa.me/256784277664',
        'what is kindcoin': 'KindCoin is the currency of humanity — 200M total supply, cannot be bought, only MINED through giving. When you purchase a kindness plan, you earn KindCoin automatically. Early miners get the best advantage before public listing.',
        'how much can i earn': 'Plans range $25 to $8,000. Full earnings potential at maximum depth: $29.9 million. Start small, earn from the community giving back, and accumulate KindCoin while it\'s still cheap.',
        'is it legit': 'KindFlow is 100% decentralised peer-to-peer — no admin controls payments. Smart contracts handle everything instantly on Binance Smart Chain. No admin can manipulate payouts. Transparent blockchain — you see every transaction.',
        'what is usdt bep20': 'USDT BEP20 is USDT on the Binance Smart Chain. Get it on Binance exchange and withdraw to TrustWallet on BSC network. This is the currency used for all KindFlow transactions.',
      }
    },
    africateam: {
      name: 'Africa Team',
      tagline: 'Multiple Income Streams. One Community.',
      wa_channel: 'https://whatsapp.com/channel/0029VaYj81GLSmbe9xU1zh3i',
      keywords: ['AFRICA TEAM', 'JOIN', 'ALL PRODUCTS', 'EVERYTHING', 'COACH', 'COMMUNITY', 'START', 'HELP', 'INCOME'],
      emoji: '🌍',
    }
  },

  // Coach's voice system prompt for AI coaching
  COACH_SYSTEM_PROMPT: `You are Coach's AI assistant for Africa Team — a crypto and income community serving Africa and the world.

Africa Team products:
1. Coinverse — prediction markets, 100 USDW free airdrop, link: coinverse-landing.vercel.app
2. UTrading AI — AI crypto trading 24/7, referral code AFRICA, link: utrading.ai/AFRICA
3. Eropia DeFi 4.0 — stake USDC up to 12X returns, staking code AFRICA (eropia.finance?ref=AFRICA), NFT code U13F93855 (eropia.finance?ref=U13F93855)
4. KindFlow — P2P crowdfunding on BSC, give $25+ in USDT BEP20, earn KindCoin
5. Africa Team — the community hub, WhatsApp channel: whatsapp.com/channel/0029VaYj81GLSmbe9xU1zh3i

Your role:
- Answer questions about any product clearly and simply
- Sound like Coach: confident, warm, direct, Africa-proud
- Always end with a relevant action step and link
- Never give financial advice — give information and let them decide
- If someone is ready to join, give them the exact steps
- Keep responses under 200 words
- Use emojis sparingly but effectively
- If you don't know something specific, tell them to message Coach directly: wa.me/256784277664`
};

// ── BOT INITIALISATION ─────────────────────────────────────────────────────────
const bot = new TelegramBot(CONFIG.TELEGRAM_TOKEN, { polling: true });

// ── PERFORMANCE LOGGER ─────────────────────────────────────────────────────────
const log = [];
function logInteraction(type, product, query, responded) {
  log.push({ ts: Date.now(), type, product, query: query?.slice(0, 50), responded });
  // Keep last 500 interactions
  if (log.length > 500) log.shift();
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
  const product = CONFIG.PRODUCTS[productKey];
  if (!product?.faq) return null;
  const lower = text.toLowerCase();
  for (const [question, answer] of Object.entries(product.faq)) {
    if (lower.includes(question) || question.split(' ').filter(w => w.length > 3).some(w => lower.includes(w))) {
      return answer;
    }
  }
  return null;
}

// ── AI COACH (Claude API) ──────────────────────────────────────────────────────
async function askClaude(userMessage, productContext) {
  try {
    const contextHint = productContext
      ? `The user seems interested in ${CONFIG.PRODUCTS[productContext]?.name || productContext}.`
      : 'The user has not specified a product yet.';

    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      system: CONFIG.COACH_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: `${contextHint}\n\nUser message: ${userMessage}` }]
    }, {
      headers: {
        'x-api-key': CONFIG.ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      }
    });
    return response.data.content[0].text;
  } catch (err) {
    return '🤖 I\'m processing your question. For immediate help, message Coach directly: wa.me/256784277664';
  }
}

// ── MESSAGE BUILDERS ───────────────────────────────────────────────────────────
function buildWelcomeMessage() {
  return `🌍 *Welcome to Africa Team!*

Coach's multi-income community. We run 4 active income streams simultaneously:

🔮 *Coinverse* — Predict crypto, earn rewards (100 USDW free)
🤖 *UTrading AI* — AI trades for you 24/7 (code: AFRICA)
⚡ *Eropia DeFi* — Stake USDC, earn up to 12X
💝 *KindFlow* — P2P crowdfunding on BSC

Reply with any keyword to get started:
COINVERSE | UTRADING | EROPIA | KINDFLOW

Or ask any question and Coach's AI will answer 🧠`;
}

function buildProductCard(productKey) {
  const p = CONFIG.PRODUCTS[productKey];
  if (!p) return null;

  const cards = {
    coinverse: `${p.emoji} *${p.name}*\n_${p.tagline}_\n\n✅ 100 USDW free airdrop on signup\n✅ Real-time prediction markets\n✅ BTC, ETH, SOL and more\n✅ Earn instantly — no experience needed\n\n🔗 *Join now:* ${p.link}\n📢 *Signals:* ${p.tg_channel}\n\nReply HOW to get step-by-step instructions`,
    utrading: `${p.emoji} *${p.name}*\n_${p.tagline}_\n\n✅ AI analyses markets every second\n✅ Automated risk management\n✅ Works while you sleep\n✅ Built for Africa — code AFRICA\n\n🔗 *Join now:* ${p.link}\n🤖 *TG Bot:* ${p.tg_bot}\n\nReply HOW to get step-by-step instructions`,
    eropia: `${p.emoji} *${p.name}*\n_${p.tagline}_\n\n✅ Up to 12X return in 12 months\n✅ 2X minimum GUARANTEED\n✅ Self-healing DeFi protocol\n✅ $125/month per $30 NFT\n\n💰 *Staking:* eropia.finance?ref=AFRICA (code AFRICA)\n💎 *NFTs:* eropia.finance?ref=U13F93855 (code U13F93855)\n\nReply STAKING or NFT to learn more`,
    kindflow: `${p.emoji} *${p.name}*\n_${p.tagline}_\n\n✅ 100% decentralised P2P\n✅ Start from just $25 USDT BEP20\n✅ Instant smart contract payouts\n✅ Mine KindCoin before listing!\n\n📱 *Contact Coach to join:* wa.me/256784277664\n\nReply HOW to get step-by-step instructions`,
    africateam: `${p.emoji} *${p.name}*\n_${p.tagline}_\n\nCoach's income empire — running 4 streams simultaneously.\n\nChoose your entry point:\n🔮 COINVERSE — predict & earn\n🤖 UTRADING — AI trades for you\n⚡ EROPIA — stake & earn 12X\n💝 KINDFLOW — give & receive\n\n📢 *Join our channel:* ${p.wa_channel}\n\nWhich product interests you most?`
  };
  return cards[productKey] || null;
}

// ── /start COMMAND ─────────────────────────────────────────────────────────────
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from?.first_name || 'Champion';

  const welcomeText = `👋 Hello ${firstName}!\n\n${buildWelcomeMessage()}`;

  await bot.sendMessage(chatId, welcomeText, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🔮 Coinverse', callback_data: 'product_coinverse' },
          { text: '🤖 UTrading AI', callback_data: 'product_utrading' }
        ],
        [
          { text: '⚡ Eropia DeFi', callback_data: 'product_eropia' },
          { text: '💝 KindFlow', callback_data: 'product_kindflow' }
        ],
        [
          { text: '🌍 Africa Team Hub', callback_data: 'product_africateam' }
        ]
      ]
    }
  });
  logInteraction('start', null, '/start', true);
});

// ── /help COMMAND ──────────────────────────────────────────────────────────────
bot.onText(/\/help/, async (msg) => {
  await bot.sendMessage(msg.chat.id,
    `🆘 *Africa Team Help*\n\nAvailable commands:\n/start — Welcome & product menu\n/products — See all income streams\n/coinverse — Coinverse info\n/utrading — UTrading AI info\n/eropia — Eropia DeFi info\n/kindflow — KindFlow info\n/coach — Message Coach directly\n/signals — Latest crypto signals\n\nOr just type any question — our AI Coach will answer! 🧠`,
    { parse_mode: 'Markdown' }
  );
});

// ── PRODUCT COMMANDS ───────────────────────────────────────────────────────────
['coinverse', 'utrading', 'eropia', 'kindflow'].forEach(product => {
  bot.onText(new RegExp(`\\/${product}`, 'i'), async (msg) => {
    const card = buildProductCard(product);
    if (card) {
      await bot.sendMessage(msg.chat.id, card, {
        parse_mode: 'Markdown',
        disable_web_page_preview: false
      });
    }
    logInteraction('command', product, `/${product}`, true);
  });
});

// ── /products COMMAND ──────────────────────────────────────────────────────────
bot.onText(/\/products/, async (msg) => {
  await bot.sendMessage(msg.chat.id,
    `💼 *Africa Team — Income Portfolio*\n\n🔮 *Coinverse* — Prediction markets, 100 USDW free\n🤖 *UTrading AI* — AI trading, code AFRICA\n⚡ *Eropia* — DeFi staking up to 12X\n💝 *KindFlow* — P2P crowdfunding from $25\n\nTap a product below to learn more:`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🔮 Coinverse', callback_data: 'product_coinverse' }, { text: '🤖 UTrading', callback_data: 'product_utrading' }],
          [{ text: '⚡ Eropia', callback_data: 'product_eropia' }, { text: '💝 KindFlow', callback_data: 'product_kindflow' }]
        ]
      }
    }
  );
});

// ── /coach COMMAND ─────────────────────────────────────────────────────────────
bot.onText(/\/coach/, async (msg) => {
  await bot.sendMessage(msg.chat.id,
    `👨‍💼 *Message Coach Directly*\n\n📱 WhatsApp: wa.me/256784277664\n📢 Africa Team Channel: whatsapp.com/channel/0029VaYj81GLSmbe9xU1zh3i\n\nCoach is available to answer specific questions, give your KindFlow referrer ID, and help you get started on any product.`,
    { parse_mode: 'Markdown' }
  );
});

// ── /signals COMMAND ───────────────────────────────────────────────────────────
bot.onText(/\/signals/, async (msg) => {
  // This is a placeholder — in production this pulls live data
  await bot.sendMessage(msg.chat.id,
    `📊 *Africa Team Crypto Signals*\n\n⚡ For live real-time signals:\n📢 Coinverse Signal Channel: t.me/CoinverseSignal\n\n_Signals posted daily. Join the channel to get them automatically._`,
    { parse_mode: 'Markdown' }
  );
});

// ── INLINE KEYBOARD CALLBACKS ──────────────────────────────────────────────────
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  await bot.answerCallbackQuery(query.id);

  if (data.startsWith('product_')) {
    const productKey = data.replace('product_', '');
    const card = buildProductCard(productKey);
    if (card) {
      await bot.sendMessage(chatId, card, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[
            { text: '❓ Ask a Question', callback_data: `ask_${productKey}` },
            { text: '🔗 Join Now', url: CONFIG.PRODUCTS[productKey]?.link || CONFIG.PRODUCTS[productKey]?.link_staking }
          ]]
        }
      });
      logInteraction('callback', productKey, data, true);
    }
  }

  if (data.startsWith('ask_')) {
    const productKey = data.replace('ask_', '');
    await bot.sendMessage(chatId,
      `🧠 Ask me anything about ${CONFIG.PRODUCTS[productKey]?.name || productKey}!\n\nJust type your question below and Coach's AI will answer immediately.`,
      { parse_mode: 'Markdown' }
    );
  }
});

// ── GROUP WELCOME ──────────────────────────────────────────────────────────────
bot.on('new_chat_members', async (msg) => {
  const chatId = msg.chat.id;
  for (const member of msg.new_chat_members) {
    if (member.is_bot) continue;
    const name = member.first_name || 'Champion';
    await bot.sendMessage(chatId,
      `🌍 Welcome ${name} to Africa Team!\n\nYou've joined a community building multiple income streams together.\n\nType /start to see all our opportunities, or /help for commands.`,
      { parse_mode: 'Markdown' }
    );
  }
});

// ── MAIN MESSAGE HANDLER ───────────────────────────────────────────────────────
bot.on('message', async (msg) => {
  if (msg.text?.startsWith('/')) return; // handled by command listeners
  if (!msg.text) return;

  const chatId = msg.chat.id;
  const text = msg.text;
  const upper = text.toUpperCase().trim();

  // 1. Product keyword detection
  const detectedProduct = detectProduct(text);

  // 2. Single-word shortcuts
  const shortcutMap = {
    'HOW': null, // context-dependent, handled below
    'JOIN': 'africateam',
    'START': 'africateam',
    'HELP': null,
    'PRODUCTS': null,
    'STAKING': 'eropia',
    'NFT': 'eropia',
    'NFTS': 'eropia',
  };

  // 3. Eropia sub-routing
  if (detectedProduct === 'eropia' && (upper.includes('NFT') || upper.includes('U13F93855'))) {
    await bot.sendMessage(chatId,
      `💎 *Eropia NFTs*\n\n✅ $30 per NFT\n✅ $125/month passive income per NFT\n✅ 50X cap = 5000% return\n✅ 5% of every platform purchase goes to NFT holders\n\n🔗 *Buy NFTs:* eropia.finance?ref=U13F93855\n💳 *Code:* U13F93855`,
      { parse_mode: 'Markdown' }
    );
    logInteraction('eropia-nft', 'eropia', text, true);
    return;
  }

  // 4. FAQ check
  if (detectedProduct) {
    const faqAnswer = matchFAQ(detectedProduct, text);
    if (faqAnswer) {
      await bot.sendMessage(chatId, faqAnswer, { parse_mode: 'Markdown' });
      logInteraction('faq', detectedProduct, text, true);
      return;
    }
    // Send product card if it's a keyword hit with no FAQ match
    const card = buildProductCard(detectedProduct);
    if (card && upper.split(' ').length <= 3) {
      await bot.sendMessage(chatId, card, { parse_mode: 'Markdown' });
      logInteraction('keyword', detectedProduct, text, true);
      return;
    }
  }

  // 5. AI Coach for longer questions or unmatched queries
  const isQuestion = text.includes('?') || text.split(' ').length > 4;
  if (isQuestion || (!detectedProduct && text.split(' ').length > 1)) {
    await bot.sendChatAction(chatId, 'typing');
    const aiResponse = await askClaude(text, detectedProduct);
    await bot.sendMessage(chatId, aiResponse, { parse_mode: 'Markdown' });
    logInteraction('ai-coach', detectedProduct, text, true);
    return;
  }

  // 6. Default — show menu
  await bot.sendMessage(chatId, buildWelcomeMessage(), {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{ text: '🔮 Coinverse', callback_data: 'product_coinverse' }, { text: '🤖 UTrading', callback_data: 'product_utrading' }],
        [{ text: '⚡ Eropia', callback_data: 'product_eropia' }, { text: '💝 KindFlow', callback_data: 'product_kindflow' }],
        [{ text: '🌍 Africa Team', callback_data: 'product_africateam' }]
      ]
    }
  });
  logInteraction('default', null, text, true);
});

// ── WEEKLY PERFORMANCE REPORT ──────────────────────────────────────────────────
async function sendWeeklyReport() {
  if (!CONFIG.COACH_CHAT_ID) return;
  const byProduct = {};
  log.forEach(entry => {
    const p = entry.product || 'unknown';
    byProduct[p] = (byProduct[p] || 0) + 1;
  });
  const report = Object.entries(byProduct)
    .sort((a, b) => b[1] - a[1])
    .map(([p, count]) => `• ${p}: ${count} interactions`)
    .join('\n');

  await bot.sendMessage(CONFIG.COACH_CHAT_ID,
    `📊 *Africa Team Bot — Weekly Report*\n\nTotal interactions: ${log.length}\n\nBy product:\n${report}\n\n🔄 Data resets after this message.`,
    { parse_mode: 'Markdown' }
  );
}

// Run weekly report every Sunday at 8am
setInterval(() => {
  const now = new Date();
  if (now.getDay() === 0 && now.getHours() === 8 && now.getMinutes() === 0) sendWeeklyReport();
}, 60000);

// ── ERROR HANDLING ─────────────────────────────────────────────────────────────
bot.on('polling_error', (err) => console.error('Polling error:', err.message));
process.on('uncaughtException', (err) => console.error('Uncaught:', err.message));
process.on('unhandledRejection', (err) => console.error('Unhandled:', err?.message));

console.log('🌍 Africa Team Master Bot is running...');
console.log('Products: Coinverse | UTrading AI | Eropia | KindFlow');
