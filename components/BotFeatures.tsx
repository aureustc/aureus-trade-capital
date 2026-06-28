"use client";

import {
  BarChart3,
  Bot,
  Brain,
  Coins,
  Globe2,
  LineChart,
  Server,
  ShieldCheck,
  Sparkles,
  Timer,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { SectionReveal } from "./SectionReveal";

const features = [
  {
    title: "Fully Automated Execution",
    desc: "Trades without any manual input once your risk rules are set.",
    icon: Bot,
  },
  {
    title: "Smart Entry & Exit Signals",
    desc: "Identifies optimal trade points using AI-driven market logic.",
    icon: Sparkles,
  },
  {
    title: "Advanced Risk Management",
    desc: "Auto stop-loss, take-profit, and lot sizing on every trade.",
    icon: ShieldCheck,
  },
  {
    title: "Multi-Currency Pair Support",
    desc: "Trades EUR/USD, GBP/USD, XAU/USD, and more from one bot.",
    icon: Globe2,
  },
  {
    title: "XAU/USD Gold Specialist",
    desc: "Optimized algorithms tuned for gold volatility patterns.",
    icon: Coins,
  },
  {
    title: "Real-Time Market Analysis",
    desc: "Processes live tick data within milliseconds of each move.",
    icon: BarChart3,
  },
  {
    title: "AI Pattern Recognition",
    desc: "Detects chart structures and continuation setups automatically.",
    icon: Brain,
  },
  {
    title: "MetaTrader 5 Only",
    desc: "Plugs into any broker terminal that supports MT5 — not compatible with MT4.",
    icon: LineChart,
  },
  {
    title: "VPS-Friendly",
    desc: "Runs 24/7 on a VPS even when your PC is switched off.",
    icon: Server,
  },
] as const;

const benefits = [
  {
    title: "Emotion-Free Trading",
    desc: "Pure logic — no fear, greed, or hesitation in execution.",
    icon: Zap,
  },
  {
    title: "No Chart Monitoring Needed",
    desc: "The bot watches markets so you don't have to stare at screens.",
    icon: BarChart3,
  },
  {
    title: "24/7 Active Trading",
    desc: "Captures opportunities across sessions while you sleep or work.",
    icon: Timer,
  },
  {
    title: "Disciplined Risk Control",
    desc: "Built-in rules help protect capital with consistent parameters.",
    icon: ShieldCheck,
  },
  {
    title: "Lightning Fast Execution",
    desc: "Millisecond-level response to signals and market shifts.",
    icon: Sparkles,
  },
  {
    title: "Built-In Strategy Library",
    desc: "Pre-configured logic you can enable without coding from scratch.",
    icon: Brain,
  },
] as const;

export function BotFeatures() {
  return (
    <SectionReveal
      id="bot-features"
      data-nav="bot-features"
      className="section-scroll relative border-y border-[var(--card-border)] bg-[var(--bg-secondary)] py-20 sm:py-28"
    >
      <div className="pointer-events-none absolute inset-0 accent-glow-bg-top opacity-70" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow">Capabilities</span>
          <h2 className="font-heading mt-3 text-3xl font-semibold text-[var(--text-primary)] sm:text-4xl lg:text-5xl">
            What the ATC Bot Does
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
            A fully automated Forex trading bot engineered for precision, speed, and
            intelligent risk control — built for serious MT5 traders.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-6">
          {features.map(({ title, desc, icon: Icon }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.06 }}
              className="feature-card group"
            >
              <div className="pro-card-icon-ring flex h-12 w-12 shrink-0 items-center justify-center transition group-hover:scale-105">
                <Icon className="h-6 w-6 text-[var(--accent)]" strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 font-heading text-base font-semibold text-[var(--text-primary)] sm:text-lg">
                {title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                {desc}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-20">
          <div className="mb-10 flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <span className="section-eyebrow">Trader benefits</span>
              <h3 className="font-heading mt-2 text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl">
                Built for real-world trading
              </h3>
            </div>
            <p className="max-w-md text-sm text-[var(--text-secondary)] sm:text-right">
              Less screen time, more consistency — the bot handles execution while you
              stay in control of your broker account.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {benefits.map(({ title, desc, icon: Icon }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.35 }}
                className="pro-card flex items-start gap-4 p-5 sm:p-6"
              >
                <div className="pro-card-icon-ring flex h-11 w-11 shrink-0 items-center justify-center">
                  <Icon className="h-5 w-5 text-[var(--accent)]" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-heading text-base font-semibold text-[var(--text-primary)]">
                    {title}
                  </h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}
