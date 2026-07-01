"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { SectionReveal } from "./SectionReveal";

const faqs = [
  {
    q: "What exactly am I buying?",
    a: "You are purchasing a license for the Aureus Trade Capital AI-assisted Forex bot — a software program that installs on your MetaTrader 5 terminal and trades automatically on your existing broker account.",
  },
  {
    q: "Do I need a specific broker?",
    a: "Yes, as long as your broker offers MetaTrader 5. The ATC bot does not support MT4.",
  },
  {
    q: "Does my money go through Aureus Trade Capital?",
    a: "No. Your funds remain entirely in your own broker account. We only provide the bot software — we never touch or manage your money.",
  },
  {
    q: "Is forex trading risky?",
    a: "Yes. Forex trading carries significant risk and losses can occur. The bot automates execution but cannot eliminate market risk. Trade with capital you can afford to lose.",
  },
  {
    q: "How do I receive the bot after purchase?",
    a: "Your license key and setup guide are sent to your email immediately after checkout. Full installation support is available.",
  },
  {
    q: "Can I run the bot on a VPS?",
    a: "Yes. Running the bot on a VPS is recommended for 24/7 uptime, especially for XAU/USD and overnight trading.",
  },
  {
    q: "Can I upgrade my plan?",
    a: "Yes. You can upgrade your plan anytime and only pay the difference.",
  },
] as const;

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <SectionReveal id="faq" data-nav="faq" className="section-scroll relative py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center font-heading text-3xl font-semibold text-[var(--text-primary)] sm:text-4xl">
          Frequently Asked Questions
        </h2>

        <div className="mt-12 space-y-3">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className="glass-panel overflow-hidden rounded-xl"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--accent-soft)] sm:text-base"
                >
                  {item.q}
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-[var(--accent)] transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="border-t border-[var(--card-border)] px-5 pb-4 pt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </SectionReveal>
  );
}
