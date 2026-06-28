"use client";

import Link from "next/link";
import { LiveMarketRates } from "./LiveMarketRates";

export function HeroShowcase() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:gap-5">
      <LiveMarketRates />

      <div className="widget-card p-4 sm:p-5">
        <p className="text-sm font-semibold text-[var(--text-primary)]">Get Your Bot License</p>
        <p className="mt-0.5 text-[10px] text-[var(--text-secondary)]">
          MT5 only · delivered to your email in minutes
        </p>

        <div className="mt-4 rounded-xl border border-[var(--card-border)] bg-[var(--bg-primary)] p-4">
          <p className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">
            ATC Bot License
          </p>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <span className="font-heading text-xl font-bold text-[var(--text-primary)]">
              From 3 Months
            </span>
            <span className="font-heading text-2xl font-bold text-[var(--accent)]">₹6,999</span>
          </div>
          <p className="mt-1 text-[10px] text-[var(--text-secondary)]">
            6 mo ₹10,999 · Yearly ₹14,999 · Lifetime ₹49,999
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["MT5", "XAU/USD", "Multi-pair"].map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-[var(--accent-soft)] px-2 py-0.5 text-[10px] font-medium text-[var(--accent-deep)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <ul className="mt-4 space-y-2 text-[11px] text-[var(--text-secondary)]">
          <li className="flex justify-between">
            <span>Platform</span>
            <span className="font-medium text-[var(--text-primary)]">MetaTrader 5 only</span>
          </li>
          <li className="flex justify-between">
            <span>Setup guide</span>
            <span className="font-medium text-[var(--accent-deep)]">Included</span>
          </li>
          <li className="flex justify-between">
            <span>License delivery</span>
            <span className="font-medium text-[var(--text-primary)]">Instant</span>
          </li>
        </ul>

        <Link
          href="#pricing"
          className="btn-primary mt-4 flex w-full items-center justify-center rounded-lg py-2.5 text-sm font-semibold"
        >
          Get License Now
        </Link>
      </div>
    </div>
  );
}
