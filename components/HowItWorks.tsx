"use client";

import { CreditCard, LineChart, Settings, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import { SectionReveal } from "./SectionReveal";

const steps = [
  {
    step: "1",
    title: "Purchase the Bot",
    desc: "Choose your plan and complete checkout instantly",
    icon: CreditCard,
  },
  {
    step: "2",
    title: "Install on MT5",
    desc: "Follow our simple setup guide to install the bot on your existing broker's trading terminal",
    icon: Terminal,
  },
  {
    step: "3",
    title: "Configure & Activate",
    desc: "Set your risk preferences and switch the bot on. It starts monitoring and trading automatically",
    icon: Settings,
  },
  {
    step: "4",
    title: "Track Results",
    desc: "Watch your trades, performance, and analytics live from your MT5 terminal",
    icon: LineChart,
  },
] as const;

export function HowItWorks() {
  return (
    <SectionReveal
      id="how-it-works"
      className="section-scroll relative overflow-hidden py-20 sm:py-28"
    >
      <div className="pointer-events-none absolute inset-0 hero-grid-bg opacity-40" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-soft)] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="section-eyebrow">Get started</span>
          <h2 className="font-heading mt-3 text-3xl font-semibold text-[var(--text-primary)] sm:text-4xl lg:text-5xl">
            How the ATC Bot Works
          </h2>
          <p className="mt-4 text-base text-[var(--text-secondary)] sm:text-lg">
            With four simple steps, you&apos;ll have the bot installed on your broker terminal —
            equipped and ready to trade.
          </p>
        </div>

        <div className="relative mt-16">
          <div
            className="pointer-events-none absolute left-[12%] right-[12%] top-14 hidden border-t-2 border-dashed border-[var(--accent-soft-strong)] lg:block"
            aria-hidden
          />

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6 items-stretch">
            {steps.map(({ step, title, desc, icon: Icon }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className="relative flex"
              >
                <div className="pro-card flex w-full flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-heading text-4xl font-bold text-[var(--accent)]">
                      {step}
                    </span>
                    <div className="pro-card-icon-ring flex h-11 w-11 shrink-0 items-center justify-center">
                      <Icon className="h-5 w-5 text-[var(--accent)]" strokeWidth={1.5} />
                    </div>
                  </div>
                  <h3 className="mt-5 font-heading text-lg font-semibold text-[var(--text-primary)]">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
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