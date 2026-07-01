"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionReveal } from "./SectionReveal";
import { HeroShowcase } from "./visuals/HeroShowcase";

const TICKER =
  "EUR/USD  |  GBP/USD  |  XAU/USD  |  USD/JPY  |  Live rates refresh every 30s  |  ";

export function Hero() {
  const line = TICKER.repeat(4);

  return (
    <SectionReveal
      id="home"
      data-nav="home"
      className="section-scroll relative overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 hero-grid-bg opacity-40" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 accent-glow-bg-top" />

      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-24 sm:px-6 lg:px-8 lg:pb-12 lg:pt-28">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="hero-announcement mx-auto lg:mx-0"
            >
              Trade Smarter. Profit Wiser.*
              <ArrowRight className="h-3.5 w-3.5" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mt-6 font-heading text-lg font-semibold tracking-wide text-[var(--text-secondary)] sm:text-xl"
            >
              Aureus Trade Capital
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-heading mt-3 text-4xl font-bold leading-[1.1] text-[var(--text-primary)] sm:text-5xl lg:text-[3.25rem] xl:text-6xl"
            >
              Trade With AI-Assisted Automation,
              <br />
              <span className="brand-gradient">Grow With the ATC Bot</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-[var(--text-secondary)] lg:mx-0"
            >
              Plug our algorithmic Forex bot into your MT5 broker terminal — secure setup, fast
              execution, and automated strategies while your funds stay in your broker
              account.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.19 }}
              className="mx-auto mt-3 max-w-lg text-[11px] leading-relaxed text-[var(--text-secondary)]/80 lg:mx-0"
            >
              Trading involves risk. The ATC bot automates execution — it does not guarantee
              profits or future results.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
            >
              <Link
                href="#pricing"
                className="btn-primary inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold sm:w-auto sm:text-base"
              >
                Get the Bot Now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#how-it-works"
                className="btn-outline-primary inline-flex w-full items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold sm:w-auto sm:text-base"
              >
                See How It Works
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <HeroShowcase />
          </motion.div>
        </div>
      </div>

      <div className="relative overflow-hidden border-y border-[var(--card-border)] bg-[var(--bg-secondary)] py-2.5">
        <div className="flex w-max animate-ticker whitespace-nowrap px-4 text-xs font-semibold text-[var(--accent)]">
          <span>{line}</span>
          <span aria-hidden>{line}</span>
        </div>
      </div>
    </SectionReveal>
  );
}
