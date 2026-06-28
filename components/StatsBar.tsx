"use client";

import { motion } from "framer-motion";
import { SectionReveal } from "./SectionReveal";
import { AnimatedCounter } from "./AnimatedCounter";

const items = [
  {
    key: "users",
    content: (
      <>
        <AnimatedCounter end={10000} suffix="+" className="text-[var(--accent)]" />{" "}
        <span className="text-[var(--text-primary)]">Bot Users</span>
      </>
    ),
  },
  {
    key: "auto",
    content: (
      <>
        <span className="text-[var(--accent)]">24/7</span>{" "}
        <span className="text-[var(--text-primary)]">Automated Trading</span>
      </>
    ),
  },
  {
    key: "strategies",
    content: (
      <>
        <AnimatedCounter end={100} suffix="+" className="text-[var(--accent)]" />{" "}
        <span className="text-[var(--text-primary)]">Strategies Built-In</span>
      </>
    ),
  },
  {
    key: "speed",
    content: (
      <>
        <AnimatedCounter end={98} suffix="ms" className="text-[var(--accent)]" />{" "}
        <span className="text-[var(--text-primary)]">Average Execution Speed</span>
      </>
    ),
  },
] as const;

export function StatsBar() {
  return (
    <SectionReveal className="relative border-y border-[var(--card-border)] bg-[var(--bg-secondary)] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="stat-pro-card"
            >
              <p className="text-base font-medium leading-snug sm:text-lg">
                {item.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
}
