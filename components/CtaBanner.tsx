"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { SectionReveal } from "./SectionReveal";

const stats = [
  { value: "10K+", label: "Bot Users" },
  { value: "24/7", label: "Automation" },
  { value: "MT5", label: "Only" },
  { value: "98ms", label: "Execution" },
] as const;

export function CtaBanner() {
  return (
    <SectionReveal className="section-scroll relative py-16 sm:py-20">
      <div className="card relative mx-4 overflow-hidden rounded-3xl border border-[var(--card-border)] bg-[var(--bg-secondary)] sm:mx-6 lg:mx-8">
        <div className="pointer-events-none absolute inset-0 hero-grid-bg opacity-25" />
        <div className="pointer-events-none absolute inset-0 accent-glow-bg" />

        <div className="relative mx-auto max-w-4xl px-6 py-14 text-center sm:py-16">
          <span className="section-eyebrow">Join Aureus Trade Capital</span>
          <h2 className="font-heading mt-3 text-3xl font-semibold text-[var(--text-primary)] sm:text-4xl lg:text-5xl">
            Start Your Bot Journey Today
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base text-[var(--text-secondary)] sm:text-lg">
            Join traders worldwide who use the ATC bot for disciplined, automated Forex
            execution on their own broker accounts.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
                className="pro-card px-3 py-4 text-center"
              >
                <p className="font-heading text-xl font-bold text-[var(--accent)] sm:text-2xl">
                  {s.value}
                </p>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">{s.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="#pricing"
              className="btn-primary inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold sm:w-auto sm:text-base"
            >
              Get the Bot Now
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#contact"
              className="btn-outline-primary inline-flex w-full items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold sm:w-auto sm:text-base"
            >
              Chat with AI Support
            </Link>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}
