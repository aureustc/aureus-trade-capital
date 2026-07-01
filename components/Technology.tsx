"use client";

import { TechPipelineVisual } from "./visuals/TechPipelineVisual";
import {
  Brain,
  Cpu,
  KeyRound,
  Laptop,
  Lock,
  Radar,
  Server,
  Shield,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { SectionReveal } from "./SectionReveal";

const stack = [
  { label: "Rule-Based & Adaptive Logic", icon: Brain },
  { label: "Real-Time Data Feed", icon: Radar },
  { label: "Pattern Recognition Engine", icon: Cpu },
  { label: "Configurable Risk Parameters", icon: Shield },
  { label: "Multi-Pair Optimizer", icon: Zap },
  { label: "Automated Signal Execution", icon: Server },
] as const;

const security = [
  { label: "No Server-Side Access to Your Account", icon: Shield },
  { label: "Encrypted License System", icon: Lock },
  { label: "Secure Bot Activation Keys", icon: KeyRound },
  { label: "Local Execution Only", icon: Laptop },
  { label: "No Data Harvesting", icon: ShieldCheck },
  { label: "One-Time or Subscription Licensing", icon: Server },
] as const;

const compat = ["MT5 Only", "Any Broker", "VPS Compatible", "Windows / VPS Server"] as const;

export function Technology() {
  return (
    <SectionReveal className="section-scroll relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <div className="max-w-xl lg:pr-4">
            <span className="section-eyebrow">Technology</span>
            <h2 className="font-heading mt-3 text-3xl font-semibold text-[var(--text-primary)] sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
              The Intelligence Behind the Bot
            </h2>
            <p className="mt-6 text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
              The ATC bot runs on a modular algorithmic stack: live data ingestion, pattern
              recognition, automated signal execution, and risk-aware execution — all tuned for
              MetaTrader 5 environments. It adapts to volatility regimes without requiring you
              to rewrite strategies by hand.
            </p>
            <div className="mt-6 rounded-xl border border-[var(--card-border)] bg-[var(--accent-soft)] p-5">
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                <strong className="font-semibold text-[var(--text-primary)]">
                  Your broker login and account data never pass through our servers.
                </strong>{" "}
                The bot runs locally on your MT5 terminal or VPS — you stay in full
                control.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-8 lg:max-w-xl lg:justify-self-end">
            <TechPipelineVisual />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {stack.map(({ label, icon: Icon }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.35 }}
                  className="tech-pill"
                >
                  <Icon className="h-4 w-4 shrink-0 text-[var(--accent)]" strokeWidth={1.75} />
                  <span>{label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 border-t border-[var(--card-border)] pt-16">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="section-eyebrow">Security & privacy</span>
              <h3 className="font-heading mt-2 text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl">
                Your account stays yours
              </h3>
            </div>
            <p className="max-w-lg text-sm text-[var(--text-secondary)]">
              Compatible with the setups professional traders already use.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {security.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="pro-card flex items-center gap-4 px-5 py-4"
              >
                <div className="feature-card-icon shrink-0">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <span className="text-sm font-medium leading-snug text-[var(--text-primary)]">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-[var(--text-secondary)]">
              Compatible with:
            </span>
            {compat.map((c) => (
              <span
                key={c}
                className="rounded-lg border border-[var(--card-border)] bg-[var(--bg-secondary)] px-3 py-1.5 text-xs font-semibold text-[var(--text-primary)]"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}
