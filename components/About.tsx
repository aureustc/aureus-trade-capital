"use client";

import { motion } from "framer-motion";
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
        <div className="mx-auto max-w-3xl">
          <h2 className="font-heading text-3xl font-semibold text-[var(--text-primary)] sm:text-4xl lg:text-5xl">
            About Aureus Trade Capital
          </h2>
          <p className="mt-6 text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
            Aureus Trade Capital builds and sells AI-assisted Forex trading bots for
            MetaTrader 5. Our bot connects directly to your existing broker account and
            executes trades automatically using algorithmic logic and configurable risk
            parameters — no manual intervention required.
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
        </div>
      </div>
    </SectionReveal>
  );
}
