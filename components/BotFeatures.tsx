"use client";

import { Bot, Coins, Globe2, LineChart, Server, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { SectionReveal } from "./SectionReveal";

const features = [
  {
    title: "Fully Automated Execution",
    desc: "Trades without manual input once risk rules are set.",
    icon: Bot,
  },
  {
    title: "XAU/USD Gold Specialist",
    desc: "Optimized algorithms tuned for gold volatility patterns.",
    icon: Coins,
  },
  {
    title: "Advanced Risk Management",
    desc: "Auto stop-loss, take-profit, and lot sizing on every trade.",
    icon: ShieldCheck,
  },
  {
    title: "Multi-Currency Pair Support",
    desc: "Trades EUR/USD, GBP/USD, XAU/USD and more from one bot.",
    icon: Globe2,
  },
  {
    title: "MetaTrader 5 Only",
    desc: "Plugs into any broker terminal that supports MT5.",
    icon: LineChart,
  },
  {
    title: "VPS-Friendly",
    desc: "Runs 24/7 on a VPS even when your PC is switched off.",
    icon: Server,
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
            configurable risk control — built for serious MT5 traders.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl gap-5 sm:grid-cols-2 sm:gap-6">
          {features.map(({ title, desc, icon: Icon }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.4, delay: (i % 2) * 0.06 }}
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
      </div>
    </SectionReveal>
  );
}
