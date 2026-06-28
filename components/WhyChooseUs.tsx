"use client";

import {
  Clock,
  Coins,
  Plug,
  Shield,
  Terminal,
  Zap,
} from "lucide-react";
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
    title: "Emotion-Free Trading",
    text: "Pure logic, zero fear or greed",
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

export function WhyChooseUs() {
  return (
    <SectionReveal className="section-scroll relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center font-heading text-3xl font-semibold text-[var(--text-primary)] sm:text-4xl lg:text-5xl">
          Why Traders Choose the ATC Bot
        </h2>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ title, text, icon: Icon }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="pro-card group p-6"
            >
              <div className="pro-card-icon-ring flex h-11 w-11 items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <Icon className="h-5 w-5 text-[var(--accent)]" strokeWidth={1.5} />
              </div>
              <h3 className="mt-5 font-heading text-lg font-semibold text-[var(--text-primary)]">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                {text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
}
