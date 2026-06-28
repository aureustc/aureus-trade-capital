"use client";

import { SectionReveal } from "./SectionReveal";

export function Newsletter() {
  return (
    <SectionReveal className="section-scroll relative py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="pro-card-accent rounded-2xl p-8 shadow-[var(--glow)] sm:p-10">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl">
              Stay Ahead of the Markets
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--text-secondary)] sm:text-base">
              Get Forex insights, bot updates, strategy tips, and trading news delivered
              to your inbox.
            </p>
            <form
              className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="flex-1 rounded-full border border-[var(--card-border)] bg-[var(--bg-card)] px-5 py-3 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft-md)]"
              />
              <button
                type="submit"
                className="btn-primary rounded-full px-8 py-3 text-sm font-semibold"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}
