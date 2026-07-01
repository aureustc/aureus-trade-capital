"use client";

import { Clock, Coins, Plug, Shield, Terminal, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { SectionReveal } from "./SectionReveal";

const cards = [
  {
    title: "Built for MT5",
    text: "Works with any broker that offers MetaTrader 5",
    icon: Terminal,
  },
  {
    title: "Plug & Play Setup",
    text: "Install in minutes with our step-by-step guide",
    icon: Plug,
  },
  {
    title: "XAU/USD Optimized",
    text: "Special gold trading algorithms built-in",
    icon: Coins,
  },
  {
    title: "Systematic Execution",
    text: "Rule-based logic, zero emotional interference",
    icon: Zap,
  },
  {
    title: "Always On",
    text: "Runs 24/7 on VPS even when you're offline",
    icon: Clock,
  },
  {
    title: "Secure & Private",
    text: "Your account data never leaves your machine",
    icon: Shield,
  },
] as const;

export function WhyChooseATC() {
  return (
    <SectionReveal className="section-scroll relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center font-heading text-3xl font-semibold text-[var(--text-primary)] sm:text-4xl lg:text-5xl">
          Why Choose ATC
        </h2>

        <div className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-2">
          {cards.map(({ title, text, icon: Icon }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="pro-card group p-5"
            >
              <div className="pro-card-icon-ring flex h-10 w-10 items-center justify-center">
                <Icon className="h-5 w-5 text-[var(--accent)]" strokeWidth={1.5} />
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold text-[var(--text-primary)]">
                {title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                {text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
}

/** @deprecated Use WhyChooseATC */
export const WhyChooseUs = WhyChooseATC;
