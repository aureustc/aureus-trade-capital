export type SupportTopic =
  | "installation"
  | "license"
  | "payment"
  | "strategy"
  | "general";

export const QUICK_TOPICS: { id: SupportTopic; label: string; prompt: string }[] = [
  {
    id: "installation",
    label: "MT5 setup",
    prompt: "How do I install the ATC bot on MetaTrader 5?",
  },
  {
    id: "license",
    label: "License",
    prompt: "My license key is not activating. What should I do?",
  },
  {
    id: "payment",
    label: "Payment",
    prompt: "I have a question about payment and pricing.",
  },
  {
    id: "strategy",
    label: "Configuration",
    prompt: "How do I configure risk and strategy settings?",
  },
];

const RESPONSES: Record<SupportTopic, string[]> = {
  installation: [
    "**MT5 installation (quick steps)**\n\n1. Purchase your license and check email for the .ex5 file and setup guide.\n2. Open **MetaTrader 5** on your PC or VPS (MT4 is not supported).\n3. Go to **File → Open Data Folder → MQL5 → Experts** and paste the ATC bot file.\n4. Restart MT5, then drag **ATC Bot** onto your chart.\n5. Enable **AutoTrading** (green button in the toolbar).\n6. Enter your license key in the bot inputs and click OK.\n\nIf the bot does not appear, refresh the Navigator panel (right-click → Refresh).",
    `**AutoTrading is off / bot not trading**\n\n• Click the **AutoTrading** button until it turns green.\n• In **Tools → Options → Expert Advisors**, enable "Allow algorithmic trading".\n• Confirm your license key is valid and matches your MT5 account number if bound.\n• Check the **Experts** tab at the bottom for error messages.\n\nStill stuck? Email **aureustradecapital@gmail.com** with a screenshot of the Experts log.`,
  ],
  license: [
    `**License activation**\n\nAfter payment, your license key is sent to your email within minutes. In MT5:\n\n1. Attach the bot to a chart.\n2. Open **Inputs** and paste your license key exactly (no spaces).\n3. Click OK and wait for "License valid" in the Experts tab.\n\n**Common issues:** expired license (renew at Pricing), wrong account number if the key is account-bound, or using MT4 instead of MT5.`,
    `**License expired or renewal**\n\nLicenses are time-based: 3 months (₹6,999), 6 months (₹10,999), yearly (₹14,999), or lifetime (₹49,999). When expired, the bot stops trading until you renew. Purchase a new duration from the **Pricing** section and email us your payment confirmation — we will send an updated key.`,
  ],
  payment: [
    `**Pricing & plans**\n\n• **3 months** — ₹6,999\n• **6 months** — ₹10,999\n• **Yearly** — ₹14,999\n• **Lifetime** — ₹49,999 (one-time)\n\n**Pay Online (Razorpay)** — cards, UPI, net banking & wallets with instant confirmation (recommended).\n\n**Manual UPI / Bank** — use details on the Pricing page, then email a payment screenshot to **aureustradecapital@gmail.com**.`,
    `**Payment not confirmed / no email**\n\nPayments are confirmed manually after you email **aureustradecapital@gmail.com** with:\n• Your name and email used at purchase\n• Plan duration (3 mo / 6 mo / yearly / lifetime)\n• Payment reference or screenshot\n\nDelivery is usually within minutes of confirmation. Check spam folder for emails from Aureus Trade Capital.`,
  ],
  strategy: [
    `**Risk & strategy settings**\n\nUse the bot's **Inputs** panel in MT5 to set lot size, max spread, trading sessions, and pairs. Start with **demo account** or minimum lot size until you are comfortable.\n\nRecommended: enable only pairs your broker offers (EUR/USD, GBP/USD, USD/JPY, XAU/USD). Do not run multiple instances on the same symbol unless the guide allows it.`,
    `**Bot trades but results vary**\n\nForex and gold carry risk. The bot automates execution but cannot guarantee profit. Ensure VPS uptime for 24/7 operation, stable internet, and a broker with low spreads on your chosen pairs. Review the Experts log daily for warnings.`,
  ],
  general: [
    `**Broker & platform**\n\nThe ATC bot works only on **MetaTrader 5**. Your funds stay in **your broker account** — Aureus Trade Capital does not hold deposits. Any MT5 broker is fine as long as AutoTrading and Expert Advisors are allowed.`,
    `**Human support**\n\nFor issues this assistant cannot resolve, email **aureustradecapital@gmail.com** with your license email, MT5 build number, and screenshots from the Experts tab. We typically respond within 24 hours.`,
  ],
};

const KEYWORD_MAP: { topic: SupportTopic; words: string[] }[] = [
  {
    topic: "installation",
    words: [
      "install",
      "setup",
      "mt5",
      "metatrader",
      "expert",
      "autotrading",
      "auto trading",
      "not working",
      "won't trade",
      "doesnt trade",
      "attach",
      "chart",
      "vps",
      "file",
      "experts",
    ],
  },
  {
    topic: "license",
    words: [
      "license",
      "licence",
      "key",
      "activation",
      "activate",
      "expired",
      "invalid",
      "renew",
      "renewal",
    ],
  },
  {
    topic: "payment",
    words: [
      "payment",
      "pay",
      "price",
      "pricing",
      "refund",
      "upi",
      "card",
      "bank",
      "invoice",
      "6999",
      "10999",
      "14999",
      "49999",
      "rupee",
      "inr",
      "checkout",
      "purchase",
      "buy",
      "billing",
    ],
  },
  {
    topic: "strategy",
    words: [
      "config",
      "configure",
      "setting",
      "risk",
      "lot",
      "strategy",
      "xau",
      "gold",
      "pair",
      "spread",
      "demo",
      "profit",
      "loss",
    ],
  },
];

function scoreMessage(message: string, words: string[]): number {
  const lower = message.toLowerCase();
  return words.reduce((score, w) => (lower.includes(w) ? score + 1 : score), 0);
}

export function detectTopic(message: string): SupportTopic {
  let best: SupportTopic = "general";
  let bestScore = 0;

  for (const { topic, words } of KEYWORD_MAP) {
    const s = scoreMessage(message, words);
    if (s > bestScore) {
      bestScore = s;
      best = topic;
    }
  }
  return best;
}

let replyIndex: Record<SupportTopic, number> = {
  installation: 0,
  license: 0,
  payment: 0,
  strategy: 0,
  general: 0,
};

export function getBotReply(message: string, forcedTopic?: SupportTopic): string {
  const topic = forcedTopic ?? detectTopic(message);
  const pool = RESPONSES[topic];
  const idx = replyIndex[topic] % pool.length;
  replyIndex[topic] = idx + 1;
  return pool[idx];
}

export function getWelcomeMessage(): string {
  return `Hi — I'm the **ATC Support Assistant**. I can help with **MT5 installation**, **license activation**, **payments & pricing**, and **bot configuration**.\n\nPick a topic below or type your question. For complex cases, email **aureustradecapital@gmail.com**.`;
}
