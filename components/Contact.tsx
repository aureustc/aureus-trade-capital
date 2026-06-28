"use client";

import { SupportChatBot } from "./SupportChatBot";
import {
  CreditCard,
  HelpCircle,
  KeyRound,
  Mail,
  MessageCircle,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";
import { SectionReveal } from "./SectionReveal";

const support = [
  { label: "Bot Installation Help", icon: Settings, topic: "installation" as const },
  { label: "License & Activation", icon: KeyRound, topic: "license" as const },
  { label: "Payment & Billing", icon: CreditCard, topic: "payment" as const },
  { label: "Strategy Configuration", icon: HelpCircle, topic: "strategy" as const },
  { label: "General Inquiries", icon: MessageCircle, topic: "general" as const },
] as const;

export function Contact() {
  return (
    <SectionReveal
      id="contact"
      data-nav="contact"
      className="section-scroll relative py-20 sm:py-28"
    >
      <div className="pointer-events-none absolute inset-0 accent-glow-bg opacity-60" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-stretch gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <span className="section-eyebrow">Support</span>
            <h2 className="font-heading mt-2 text-3xl font-semibold text-[var(--text-primary)] sm:text-4xl lg:text-5xl">
              We&apos;re Here to Help
            </h2>
            <p className="mt-4 max-w-xl text-base text-[var(--text-secondary)]">
              Use our AI assistant for instant answers on MT5 setup, licenses, and payments.
              Still need a human? Email us anytime.
            </p>

            <a
              href="mailto:aureustradecapital@gmail.com"
              className="pro-card-interactive mt-8 flex items-center gap-4 rounded-2xl p-4"
            >
              <div className="pro-card-icon-ring flex h-12 w-12 shrink-0 items-center justify-center">
                <Mail className="h-5 w-5 text-[var(--accent)]" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  Email support
                </p>
                <p className="mt-0.5 text-sm font-medium text-[var(--text-primary)] sm:text-base">
                  aureustradecapital@gmail.com
                </p>
              </div>
            </a>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {support.map(({ label, icon: Icon }, i) => (
                <motion.li
                  key={label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.35 }}
                >
                  <div className="pro-card group flex h-full items-center gap-3 rounded-2xl p-4">
                    <div className="pro-card-icon-ring flex h-10 w-10 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-105">
                      <Icon className="h-4 w-4 text-[var(--accent)]" strokeWidth={1.75} />
                    </div>
                    <span className="text-sm font-medium text-[var(--text-secondary)] transition-colors group-hover:text-[var(--text-primary)]">
                      {label}
                    </span>
                  </div>
                </motion.li>
              ))}
            </ul>

            <p className="mt-8 text-xs leading-relaxed text-[var(--text-secondary)]">
              The AI assistant answers common questions instantly. For payment confirmation or
              complex technical issues, include your license email and MT5 Experts log when
              contacting support.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full lg:justify-self-end"
          >
            <SupportChatBot />
          </motion.div>
        </div>
      </div>
    </SectionReveal>
  );
}
