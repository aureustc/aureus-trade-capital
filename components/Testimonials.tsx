"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { SectionReveal } from "./SectionReveal";

const testimonials = [
  {
    quote:
      "The ATC bot has been running on my MT5 for 3 months. Consistent, disciplined, and completely hands-free.",
    name: "Rahul M.",
    initial: "R",
  },
  {
    quote:
      "Setup was incredibly easy. Had the bot live on my broker within 20 minutes.",
    name: "Priya S.",
    initial: "P",
  },
  {
    quote:
      "The bot setup was straightforward and the support team was responsive.",
    name: "Arjun K.",
    initial: "A",
  },
  {
    quote: "Great support team and the bot just works. No babysitting required.",
    name: "Sneha T.",
    initial: "S",
  },
] as const;

export function Testimonials() {
  return (
    <SectionReveal className="section-scroll relative bg-[var(--bg-secondary)]/50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center font-heading text-3xl font-semibold text-[var(--text-primary)] sm:text-4xl lg:text-5xl">
          What Bot Users Are Saying
        </h2>

        <div className="mt-12 flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible lg:gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="pro-card min-w-[280px] shrink-0 p-6 sm:min-w-0"
            >
              <div className="flex gap-0.5 text-[var(--accent)]">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#060a14] font-heading text-sm font-bold text-[var(--accent)]">
                  {t.initial}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    — {t.name}
                  </p>
                  <p className="mt-0.5 text-[10px] text-[var(--text-secondary)]">
                    Unverified early user review
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-3xl text-center text-xs leading-relaxed text-[var(--text-secondary)]">
          Reviews are from early beta participants. Individual results vary. These are personal
          experiences and do not represent typical outcomes.
        </p>
      </div>
    </SectionReveal>
  );
}
