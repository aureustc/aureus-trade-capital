"use client";

import { motion } from "framer-motion";
import { PerformanceDashboard } from "./visuals/PerformanceDashboard";
import { SectionReveal } from "./SectionReveal";

const pillars = [
  { n: "01", title: "Innovation", text: "Continuously evolving algorithms" },
  { n: "02", title: "Transparency", text: "Clear logic, honest results" },
  { n: "03", title: "Performance", text: "Built for trading efficiency" },
  { n: "04", title: "Security", text: "Your broker credentials stay yours" },
] as const;

export function About() {
  return (
    <SectionReveal
      id="about"
      data-nav="about"
      className="section-scroll relative py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <h2 className="font-heading text-3xl font-semibold text-[var(--text-primary)] sm:text-4xl lg:text-5xl">
              About Aureus Trade Capital
            </h2>
            <p className="mt-6 text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
              Aureus Trade Capital is a fintech product company. We build and sell
              AI-powered Forex trading bots designed for MetaTrader 5. Our bot
              is engineered to connect directly to your existing broker account and trade
              automatically using advanced machine learning, real-time market data, and
              intelligent risk management — so you don&apos;t have to.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {pillars.map((p, i) => (
                <motion.div
                  key={p.n}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  className="pro-card p-5"
                >
                  <p className="font-heading text-sm font-semibold text-[var(--accent)]">
                    {p.n}
                  </p>
                  <h3 className="mt-2 font-heading text-lg font-semibold text-[var(--text-primary)]">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">{p.text}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="pro-card p-6"
              >
                <h4 className="font-heading text-lg font-semibold text-[var(--accent-hover)]">
                  Vision
                </h4>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                  To make professional-grade AI trading technology accessible to every
                  trader worldwide through intelligent bot automation.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="pro-card p-6"
              >
                <h4 className="font-heading text-lg font-semibold text-[var(--accent-hover)]">
                  Mission
                </h4>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                  To deliver a reliable, easy-to-use AI Forex bot that handles market
                  analysis, risk control, and trade execution automatically.
                </p>
              </motion.div>
            </div>
          </div>

          <div className="relative w-full lg:max-w-md lg:justify-self-end xl:max-w-lg">
            <PerformanceDashboard />
            <p className="mt-3 text-center text-xs text-[var(--text-secondary)] lg:text-left">
              Illustrative metrics — track how the bot performs on your account.
            </p>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}
