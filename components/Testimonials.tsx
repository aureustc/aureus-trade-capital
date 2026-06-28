"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { SectionReveal } from "./SectionReveal";

const testimonials = [
  {
    quote:
      "The ATC bot has been running on my MT5 for 3 months. Consistent, disciplined, and completely hands-free.",
    name: "Rahul M.",
    img: "https://i.pravatar.cc/60?img=1",
  },
  {
    quote:
      "Setup was incredibly easy. Had the bot live on my broker within 20 minutes.",
    name: "Priya S.",
    img: "https://i.pravatar.cc/60?img=2",
  },
  {
    quote:
      "Finally a bot that actually manages risk properly. XAU/USD performance has been impressive.",
    name: "Arjun K.",
    img: "https://i.pravatar.cc/60?img=3",
  },
  {
    quote: "Great support team and the bot just works. No babysitting required.",
    name: "Sneha T.",
    img: "https://i.pravatar.cc/60?img=4",
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
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <Image
                  src={t.img}
                  alt={t.name}
                  width={48}
                  height={48}
                  className="rounded-full border border-[var(--card-border)]"
                />
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  — {t.name}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
}
