"use client";

import Link from "next/link";
import { Camera, Link2, Phone, Send, Users } from "lucide-react";

const links = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Bot Features", href: "/#bot-features" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Risk Disclosure", href: "/risk-disclosure" },
  { label: "Refund Policy", href: "/refund-policy" },
] as const;

const phones = ["9011169852", "9011169057"] as const;

const socials = [
  { label: "LinkedIn", href: "https://linkedin.com", icon: Link2 },
  {
    label: "Instagram",
    href: "https://instagram.com/aureustradecapital",
    icon: Camera,
  },
  { label: "Facebook", href: "https://facebook.com", icon: Users },
  {
    label: "Telegram",
    href: "https://t.me/aureustradecapital",
    icon: Send,
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-[var(--card-border)] bg-[#060a14] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <Link href="/#home" className="flex items-center gap-3">
              <span className="pro-card-icon-ring flex h-10 w-10 items-center justify-center font-heading text-lg font-semibold text-[var(--accent-deep)]">
                ATC
              </span>
              <span className="font-heading text-lg font-semibold text-[var(--text-primary)]">
                Aureus Trade Capital
              </span>
            </Link>
            <p className="mt-4 text-sm text-[var(--text-secondary)]">
              Smart Bot. Smarter Trading.
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--card-border)] text-[var(--text-secondary)] transition hover:border-[var(--accent)]/40 hover:text-[var(--accent-hover)] hover:shadow-[var(--glow)]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
              Links
            </h3>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-[var(--text-secondary)] transition hover:text-[var(--accent-hover)]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-[var(--text-secondary)]">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
                <div className="space-y-1">
                  {phones.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:+91${phone}`}
                      className="block font-medium text-[var(--text-primary)] transition hover:text-[var(--accent-hover)]"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Camera className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
                <div>
                  <span className="text-xs text-[var(--text-secondary)]">Instagram</span>
                  <a
                    href="https://instagram.com/aureustradecapital"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 block font-medium text-[var(--text-primary)] transition hover:text-[var(--accent-hover)]"
                  >
                    @aureustradecapital
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Send className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
                <div>
                  <span className="text-xs text-[var(--text-secondary)]">Telegram</span>
                  <a
                    href="https://t.me/aureustradecapital"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 block font-medium text-[var(--text-primary)] transition hover:text-[var(--accent-hover)]"
                  >
                    t.me/aureustradecapital
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-10 text-xs leading-relaxed text-[var(--text-secondary)]">
          Aureus Trade Capital is a software product company. We sell automated trading bot
          software for MetaTrader 5. We are not a broker, investment advisor, or fund manager.
          Forex trading involves substantial risk of loss. Past demo performance does not
          represent live trading results. Use our software responsibly.
        </p>
        <p className="mt-4 text-xs text-[var(--text-secondary)]/80">
          © 2026 Aureus Trade Capital. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
